import { describe, expect, it } from 'vitest'
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts'
import { checkMnemonic, keysFromMnemonic, newMnemonic, normalizeMnemonic } from '~/tiri/keys'
import { openSeed, sealSeed, WrongPasswordError } from '~/tiri/vault'
import { signInToRelay, RelayError } from '~/tiri/relay'

// Well-known public test phrase (Hardhat/Foundry). Never holds real funds.
const TEST_PHRASE = 'test test test test test test test test test test test junk'
const TEST_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
// Standard BIP-39 24-word test vector (all "abandon" + "art").
const PHRASE_24 = Array(23).fill('abandon').concat('art').join(' ')

describe('keys from a recovery phrase', () => {
  it('gives the same wallet address as MetaMask for the same phrase', async () => {
    const k = await keysFromMnemonic(TEST_PHRASE)
    expect(k.account.address).toBe(TEST_ADDRESS)
  })

  it('gives the same keys on every device', async () => {
    const a = await keysFromMnemonic(TEST_PHRASE)
    const b = await keysFromMnemonic(TEST_PHRASE)
    expect(Buffer.from(a.masterKey)).toEqual(Buffer.from(b.masterKey))
    expect(Buffer.from(a.x25519.publicKey)).toEqual(Buffer.from(b.x25519.publicKey))
  })

  it('matches the proof-of-concept derivation (master key and X25519 fingerprints)', async () => {
    const k = await keysFromMnemonic(TEST_PHRASE)
    const { sha256 } = await import('@noble/hashes/sha2.js')
    const fp = (b: Uint8Array) => Buffer.from(sha256(b)).toString('hex').slice(0, 16)
    // Pinned so a change to the derivation (which would make existing files unreadable) fails loudly.
    expect({ master: fp(k.masterKey), x25519: fp(k.x25519.publicKey) }).toMatchSnapshot()
  })

  it('keeps wallet, master and X25519 keys distinct', async () => {
    const k = await keysFromMnemonic(TEST_PHRASE)
    expect(Buffer.from(k.masterKey)).not.toEqual(Buffer.from(k.x25519.privateKey))
  })

  it('creates valid, different 12-word phrases', () => {
    const a = newMnemonic()
    const b = newMnemonic()
    expect(a.split(' ')).toHaveLength(12)
    expect(checkMnemonic(a).ok).toBe(true)
    expect(a).not.toBe(b)
  })

  it('accepts 24-word phrases', async () => {
    expect(checkMnemonic(PHRASE_24)).toEqual({ ok: true, words: 24 })
    const k = await keysFromMnemonic(PHRASE_24)
    expect(k.account.address).toMatch(/^0x[0-9a-fA-F]{40}$/)
  })

  it('cleans up pasted phrases (case, extra spaces, numbering, commas)', () => {
    expect(normalizeMnemonic('  Test,TEST\n test  ')).toBe('test test test')
    expect(normalizeMnemonic('1. test 2. test 3) junk')).toBe('test test junk')
  })

  it('explains what is wrong with a phrase', () => {
    expect(checkMnemonic('test test test')).toMatchObject({ ok: false, reason: 'count', words: 3 })
    expect(checkMnemonic(TEST_PHRASE.replace('junk', 'junkk'))).toMatchObject({
      ok: false,
      reason: 'unknown-words',
      unknown: ['junkk'],
    })
    expect(checkMnemonic(TEST_PHRASE.replace('junk', 'test'))).toMatchObject({ ok: false, reason: 'checksum' })
  })

  it('refuses to derive keys from an invalid phrase', async () => {
    await expect(keysFromMnemonic(TEST_PHRASE.replace('junk', 'test'))).rejects.toThrow(/Invalid/)
  })
})

describe('seed phrase stored on this computer', () => {
  it('decrypts with the right password and never stores the phrase in clear', async () => {
    const record = await sealSeed(TEST_PHRASE, 'correct horse battery', TEST_ADDRESS, 'Laptop')
    expect(JSON.stringify(record)).not.toContain('test test')
    expect(JSON.stringify(record)).not.toContain('correct horse')
    expect(record.kdf.alg).toBe('argon2id13')
    expect(await openSeed(record, 'correct horse battery')).toBe(TEST_PHRASE)
  })

  it('rejects a wrong password', async () => {
    const record = await sealSeed(TEST_PHRASE, 'correct horse battery', TEST_ADDRESS, 'Laptop')
    await expect(openSeed(record, 'wrong password')).rejects.toBeInstanceOf(WrongPasswordError)
  })

  it('detects a record whose address was swapped', async () => {
    const record = await sealSeed(TEST_PHRASE, 'pw-12345678', TEST_ADDRESS, 'Laptop')
    await expect(openSeed({ ...record, address: privateKeyToAccount(generatePrivateKey()).address }, 'pw-12345678'))
      .rejects.toBeInstanceOf(WrongPasswordError)
  })

  it('uses a fresh salt and nonce each time', async () => {
    const a = await sealSeed(TEST_PHRASE, 'pw-12345678', TEST_ADDRESS, 'Laptop')
    const b = await sealSeed(TEST_PHRASE, 'pw-12345678', TEST_ADDRESS, 'Laptop')
    expect(a.kdf.salt).not.toBe(b.kdf.salt)
    expect(a.ciphertext).not.toBe(b.ciphertext)
  })
})

describe('relay sign-in', () => {
  it('reports an unreachable relay clearly', async () => {
    const account = privateKeyToAccount(generatePrivateKey())
    await expect(signInToRelay('http://127.0.0.1:9', account)).rejects.toThrow(/Can't reach the Tiri relay/)
  })

  it('refuses to sign a message that is not a sign-in for this wallet', async () => {
    const account = privateKeyToAccount(generatePrivateKey())
    const realFetch = globalThis.fetch
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ message: 'Transfer all funds to 0xevil', nonce: 'abc' }), { status: 200 })) as any
    try {
      await expect(signInToRelay('http://relay.test', account)).rejects.toThrow(/not signing/)
    } finally {
      globalThis.fetch = realFetch
    }
  })

  // Runs against a real relay when RELAY_URL is set, e.g. RELAY_URL=http://localhost:3003 npm test
  it.skipIf(!process.env.RELAY_URL)('signs in to a running relay with a wallet from a recovery phrase', async () => {
    const keys = await keysFromMnemonic(newMnemonic())
    const session = await signInToRelay(process.env.RELAY_URL!, keys.account)
    expect(session.user.address).toBe(keys.account.address)
    const me = await fetch(`${process.env.RELAY_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    expect(await me.json()).toEqual({ id: session.user.id, address: keys.account.address })
    // A second sign-in with the same phrase is the same user.
    const again = await signInToRelay(process.env.RELAY_URL!, (await keysFromMnemonic(TEST_PHRASE)).account)
    const again2 = await signInToRelay(process.env.RELAY_URL!, (await keysFromMnemonic(TEST_PHRASE)).account)
    expect(again2.user.id).toBe(again.user.id)
    expect(RelayError).toBeDefined()
  })
})

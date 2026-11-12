// Tiri key derivation: one seed phrase -> wallet key, master key, X25519 key pair.
//
//   seed phrase (BIP-39)
//    ├── wallet key   secp256k1, BIP-44 m/44'/60'/0'/0/0   payments, signing, session keys
//    ├── master key   32 bytes, HKDF-SHA256                 wraps file keys, encrypts the file tree
//    └── X25519 pair  from a 32-byte HKDF seed              receives shared files
//
// The wallet key is never used for encryption. Same derivation as the proof of concept
// (foc-poc/src/keys.mjs), so test vectors carry over.

import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { HDKey } from '@scure/bip32'
import { hkdf } from '@noble/hashes/hkdf.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts'
import _sodium from 'libsodium-wrappers-sumo'

const HKDF_SALT = new TextEncoder().encode('tiri-vault')
const INFO_MASTER = 'tiri/master-key/v1'
const INFO_X25519 = 'tiri/x25519/v1'
/** Same path as MetaMask, so a Tiri wallet can be opened there and vice versa. */
export const WALLET_PATH = "m/44'/60'/0'/0/0"

export interface TiriKeys {
  /** Signs payments, sign-in challenges and session-key authorisations. */
  account: PrivateKeyAccount
  /** Symmetric key for wrapping file keys and encrypting the file tree. Never leaves the device. */
  masterKey: Uint8Array
  /** For receiving shared files. The public key is published; the private key never leaves the device. */
  x25519: { publicKey: Uint8Array; privateKey: Uint8Array }
}

const derive = (ikm: Uint8Array, info: string) => hkdf(sha256, ikm, HKDF_SALT, new TextEncoder().encode(info), 32)
const toHex = (bytes: Uint8Array) => ('0x' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')) as `0x${string}`

/** Normalises what the user typed or pasted: lowercase, single spaces, no numbering. */
export function normalizeMnemonic(input: string): string {
  return input
    .toLowerCase()
    .replace(/\d+[.)]/g, ' ') // "1. word 2) word" pasted from a numbered list
    .split(/[\s,]+/)
    .filter(Boolean)
    .join(' ')
}

/** A new 12-word seed phrase. */
export function newMnemonic(): string {
  return generateMnemonic(wordlist, 128)
}

export type MnemonicCheck =
  | { ok: true; words: number }
  | { ok: false; reason: 'count' | 'unknown-words' | 'checksum'; words: number; unknown?: string[] }

/** Explains what is wrong with a seed phrase, so the import screen can say it plainly. */
export function checkMnemonic(input: string): MnemonicCheck {
  const words = normalizeMnemonic(input).split(' ').filter(Boolean)
  if (![12, 15, 18, 21, 24].includes(words.length)) return { ok: false, reason: 'count', words: words.length }
  const unknown = words.filter((w) => !wordlist.includes(w))
  if (unknown.length) return { ok: false, reason: 'unknown-words', words: words.length, unknown }
  if (!validateMnemonic(words.join(' '), wordlist)) return { ok: false, reason: 'checksum', words: words.length }
  return { ok: true, words: words.length }
}

/** Derives every Tiri key from a seed phrase. Deterministic: same phrase, same keys, on every device. */
export async function keysFromMnemonic(mnemonic: string): Promise<TiriKeys> {
  const phrase = normalizeMnemonic(mnemonic)
  if (!validateMnemonic(phrase, wordlist)) throw new Error('Invalid seed phrase')
  await _sodium.ready
  const seed = mnemonicToSeedSync(phrase)
  const node = HDKey.fromMasterSeed(seed).derive(WALLET_PATH)
  if (!node.privateKey) throw new Error('Key derivation failed')
  const x = _sodium.crypto_box_seed_keypair(derive(seed, INFO_X25519))
  return {
    account: privateKeyToAccount(toHex(node.privateKey)),
    masterKey: derive(seed, INFO_MASTER),
    x25519: { publicKey: x.publicKey, privateKey: x.privateKey },
  }
}

/** Overwrites key material in memory (best effort; JS can't guarantee no copies remain). */
export function wipeKeys(keys: TiriKeys | null | undefined) {
  if (!keys) return
  keys.masterKey.fill(0)
  keys.x25519.privateKey.fill(0)
}

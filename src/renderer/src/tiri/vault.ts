// The seed phrase at rest, on this device only.
//
// The seed is encrypted with a key derived from the user's unlock password (Argon2id),
// using XChaCha20-Poly1305 with the wallet address as associated data. Neither the
// password nor any hash of it is ever stored. Forgetting the password means
// re-entering the seed phrase; there is no other recovery.

import _sodium from 'libsodium-wrappers-sumo'
import Dexie, { type Table } from 'dexie'

export interface VaultRecord {
  id: 'main'
  format: 1
  /** Checksummed wallet address, shown on the unlock screen. */
  address: string
  /** Name of this device, used e.g. in conflicted-copy file names. */
  deviceName: string
  kdf: { alg: 'argon2id13'; opslimit: number; memlimit: number; salt: string }
  nonce: string
  ciphertext: string
  createdAt: string
}

export class WrongPasswordError extends Error {
  constructor() {
    super('Wrong password')
    this.name = 'WrongPasswordError'
  }
}

class VaultDb extends Dexie {
  vault!: Table<VaultRecord, string>
  constructor() {
    super('tiri-vault')
    this.version(1).stores({ vault: 'id' })
  }
}

let db: VaultDb | null = null
const getDb = () => (db ??= new VaultDb())

// Plain base64 (libsodium's own helper fails in the bundled browser build).
function b64(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}
function unb64(s: string): Uint8Array {
  const bin = atob(s)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

/** Minimum password length accepted when creating a vault. */
export const MIN_PASSWORD_LENGTH = 8

/** Encrypts a seed phrase with a password. Takes about a second on purpose (Argon2id). */
export async function sealSeed(
  mnemonic: string,
  password: string,
  address: string,
  deviceName: string,
): Promise<VaultRecord> {
  await _sodium.ready
  const s = _sodium
  const salt = s.randombytes_buf(s.crypto_pwhash_SALTBYTES)
  const opslimit = s.crypto_pwhash_OPSLIMIT_INTERACTIVE
  const memlimit = s.crypto_pwhash_MEMLIMIT_INTERACTIVE
  const key = s.crypto_pwhash(32, password, salt, opslimit, memlimit, s.crypto_pwhash_ALG_ARGON2ID13)
  const nonce = s.randombytes_buf(s.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES)
  const ciphertext = s.crypto_aead_xchacha20poly1305_ietf_encrypt(mnemonic, address, null, nonce, key)
  key.fill(0)
  return {
    id: 'main',
    format: 1,
    address,
    deviceName,
    kdf: { alg: 'argon2id13', opslimit, memlimit, salt: b64(salt) },
    nonce: b64(nonce),
    ciphertext: b64(ciphertext),
    createdAt: new Date().toISOString(),
  }
}

/** Decrypts the seed phrase. Throws WrongPasswordError if the password doesn't match. */
export async function openSeed(record: VaultRecord, password: string): Promise<string> {
  await _sodium.ready
  const s = _sodium
  const key = s.crypto_pwhash(
    32,
    password,
    unb64(record.kdf.salt),
    record.kdf.opslimit,
    record.kdf.memlimit,
    s.crypto_pwhash_ALG_ARGON2ID13,
  )
  // Only an authentication failure of the decryption itself means "wrong password".
  let plain: Uint8Array
  try {
    plain = s.crypto_aead_xchacha20poly1305_ietf_decrypt(
      null,
      unb64(record.ciphertext),
      record.address,
      unb64(record.nonce),
      key,
    )
  } catch (err: any) {
    if (/incorrect|ciphertext|decrypt|forged/i.test(String(err?.message ?? err))) throw new WrongPasswordError()
    throw err
  } finally {
    key.fill(0)
  }
  return new TextDecoder().decode(plain)
}

export async function loadVault(): Promise<VaultRecord | undefined> {
  return getDb().vault.get('main')
}

export async function saveVault(record: VaultRecord): Promise<void> {
  await getDb().vault.put(record)
}

/** Removes the wallet from this device. Files and funds are untouched; the seed phrase restores them. */
export async function deleteVault(): Promise<void> {
  await getDb().vault.delete('main')
}

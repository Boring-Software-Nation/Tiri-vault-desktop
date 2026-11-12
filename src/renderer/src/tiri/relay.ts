// Wallet sign-in to the Tiri relay: the relay sends a one-time message, the wallet
// signs it (no transaction, no fee), and the relay returns a session token.

import type { PrivateKeyAccount } from 'viem/accounts'

export interface RelaySession {
  token: string
  expiresAt: string
  user: { id: number; address: string }
}

export class RelayError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = 'RelayError'
  }
}

async function post<T>(baseUrl: string, path: string, body: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${baseUrl}/api${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new RelayError(`Can't reach the Tiri relay at ${baseUrl}`)
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new RelayError(data?.message ?? `Relay error ${res.status}`, res.status)
  return data as T
}

/** Signs in with the wallet and returns a session for `Authorization: Bearer <token>`. */
export async function signInToRelay(baseUrl: string, account: PrivateKeyAccount): Promise<RelaySession> {
  if (!baseUrl) throw new RelayError('No relay address configured (VITE_API_HOST)')
  const challenge = await post<{ message: string; nonce: string }>(baseUrl, '/auth/challenge', {
    address: account.address,
  })
  // Refuse to sign anything that isn't a sign-in message for this wallet.
  if (!challenge.message.includes(account.address) || !challenge.message.includes(`Nonce: ${challenge.nonce}`)) {
    throw new RelayError('The relay sent an unexpected sign-in message; not signing it')
  }
  const signature = await account.signMessage({ message: challenge.message })
  return post<RelaySession>(baseUrl, '/auth/verify', { address: account.address, nonce: challenge.nonce, signature })
}

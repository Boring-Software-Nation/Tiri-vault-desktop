// Read-only access to the Filecoin network (FEVM) for balances.

import { createPublicClient, erc20Abi, formatUnits, http, type Address } from 'viem'
import { filecoin, filecoinCalibration } from 'viem/chains'

export type FilecoinNetwork = 'calibration' | 'mainnet'

export const NETWORK: FilecoinNetwork =
  import.meta.env.VITE_FILECOIN_NETWORK === 'mainnet' ? 'mainnet' : 'calibration'

const chain = NETWORK === 'mainnet' ? filecoin : filecoinCalibration

/** USDFC, the stablecoin Filecoin Onchain Cloud is paid in. */
export const USDFC_ADDRESS: Address =
  NETWORK === 'mainnet' ? '0x80B98d3aa09ffff255c3ba4A241111Ff1262F045' : '0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0'

export const RPC_URL: string =
  import.meta.env.VITE_FILECOIN_RPC_URL ||
  (NETWORK === 'mainnet' ? 'https://api.node.glif.io/rpc/v1' : 'https://api.calibration.node.glif.io/rpc/v1')

export const NETWORK_LABEL = NETWORK === 'mainnet' ? 'Filecoin' : 'Filecoin Calibration (testnet)'
export const FIL_SYMBOL = NETWORK === 'mainnet' ? 'FIL' : 'tFIL'
export const USDFC_SYMBOL = NETWORK === 'mainnet' ? 'USDFC' : 'tUSDFC'

/** Faucets for free test tokens (testnet only). From the Filecoin docs. */
export const FAUCETS =
  NETWORK === 'calibration'
    ? [
        { label: 'Get test FIL', url: 'https://faucet.calibnet.chainsafe-fil.io/funds.html' },
        { label: 'Get test USDFC', url: 'https://forest-explorer.chainsafe.dev/faucet/calibnet_usdfc' },
      ]
    : []

const client = createPublicClient({ chain, transport: http(RPC_URL, { timeout: 15_000, retryCount: 1 }) })

export interface Balances {
  fil: string
  usdfc: string
  updatedAt: string
}

/** Wallet balances, formatted with up to 4 decimals. */
export async function getBalances(address: Address): Promise<Balances> {
  const [fil, usdfc] = await Promise.all([
    client.getBalance({ address }),
    client.readContract({ address: USDFC_ADDRESS, abi: erc20Abi, functionName: 'balanceOf', args: [address] }),
  ])
  return { fil: formatAmount(fil), usdfc: formatAmount(usdfc), updatedAt: new Date().toISOString() }
}

export function formatAmount(value: bigint, decimals = 18): string {
  const n = Number(formatUnits(value, decimals))
  return n.toLocaleString('en-US', { maximumFractionDigits: 4 })
}

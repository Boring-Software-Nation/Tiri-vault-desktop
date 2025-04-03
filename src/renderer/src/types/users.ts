export interface ConsensusState {
  synced: boolean
}

export interface User {
  consensusState?: ConsensusState
  token?: string

  unlockPassword?: Uint8Array
  seed?: string
}

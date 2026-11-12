import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { CONFIG } from '~/env'
import { keysFromMnemonic, wipeKeys, type TiriKeys } from '~/tiri/keys'
import { deleteVault, loadVault, openSeed, saveVault, sealSeed } from '~/tiri/vault'
import { signInToRelay, type RelaySession } from '~/tiri/relay'
import { getBalances, type Balances } from '~/tiri/chain'

export type WalletStatus = 'loading' | 'no-wallet' | 'locked' | 'unlocked'
export type RelayStatus = 'signed-out' | 'signing-in' | 'signed-in' | 'error'

/**
 * The user's wallet on this device: whether one exists, whether it's unlocked,
 * the keys in memory while unlocked, and the relay session.
 */
export const useTiriStore = defineStore('tiri', () => {
  const status = ref<WalletStatus>('loading')
  const address = ref<string>('')
  const deviceName = ref<string>('')
  /** Key material: only in memory, only while unlocked. Not reactive on purpose. */
  const keys = shallowRef<TiriKeys | null>(null)
  const session = shallowRef<RelaySession | null>(null)
  const relayStatus = ref<RelayStatus>('signed-out')
  const relayError = ref('')
  const balances = ref<Balances | null>(null)
  const balancesError = ref('')
  const balancesLoading = ref(false)

  const isUnlocked = computed(() => status.value === 'unlocked')

  /** Reads the vault from local storage. Call once at app start. */
  async function init() {
    const record = await loadVault()
    address.value = record?.address ?? ''
    deviceName.value = record?.deviceName ?? ''
    status.value = record ? 'locked' : 'no-wallet'
  }

  /** Saves a new or imported wallet, encrypted with the password, and unlocks it. */
  async function setUpWallet(mnemonic: string, password: string, device: string) {
    const derived = await keysFromMnemonic(mnemonic)
    const record = await sealSeed(mnemonic, password, derived.account.address, device)
    await saveVault(record)
    await becomeUnlocked(derived, record.address, record.deviceName)
  }

  /** Unlocks with the password. Throws WrongPasswordError. */
  async function unlock(password: string) {
    const record = await loadVault()
    if (!record) {
      status.value = 'no-wallet'
      throw new Error('No wallet on this device')
    }
    const mnemonic = await openSeed(record, password)
    const derived = await keysFromMnemonic(mnemonic)
    if (derived.account.address !== record.address) {
      throw new Error('Stored wallet is damaged: address mismatch')
    }
    await becomeUnlocked(derived, record.address, record.deviceName)
  }

  async function becomeUnlocked(derived: TiriKeys, addr: string, device: string) {
    wipeKeys(keys.value)
    keys.value = derived
    address.value = addr
    deviceName.value = device
    status.value = 'unlocked'
    // Neither blocks unlocking: both work in the background and show their own status.
    void signIn()
    void refreshBalances()
  }

  /** Signs in to the relay with the wallet. Safe to call again (e.g. "Retry"). */
  async function signIn() {
    if (!keys.value) return
    relayStatus.value = 'signing-in'
    relayError.value = ''
    try {
      session.value = await signInToRelay(CONFIG.API_HOST, keys.value.account)
      relayStatus.value = 'signed-in'
    } catch (err: any) {
      session.value = null
      relayStatus.value = 'error'
      relayError.value = err?.message ?? String(err)
    }
  }

  async function refreshBalances() {
    if (!address.value) return
    balancesLoading.value = true
    balancesError.value = ''
    try {
      balances.value = await getBalances(address.value as `0x${string}`)
    } catch (err: any) {
      balancesError.value = "Couldn't reach the Filecoin network"
      console.error('balances', err)
    } finally {
      balancesLoading.value = false
    }
  }

  /** Forgets the keys in memory. The encrypted vault stays; the password unlocks it again. */
  function lock() {
    wipeKeys(keys.value)
    keys.value = null
    session.value = null
    relayStatus.value = 'signed-out'
    balances.value = null
    status.value = address.value ? 'locked' : 'no-wallet'
  }

  /** Removes the wallet from this device. Only the seed phrase can bring it back. */
  async function removeWalletFromDevice() {
    lock()
    await deleteVault()
    address.value = ''
    deviceName.value = ''
    status.value = 'no-wallet'
  }

  return {
    status,
    isUnlocked,
    address,
    deviceName,
    keys,
    session,
    relayStatus,
    relayError,
    balances,
    balancesError,
    balancesLoading,
    init,
    setUpWallet,
    unlock,
    signIn,
    refreshBalances,
    lock,
    removeWalletFromDevice,
  }
})

<template>
  <div class="setup-screen">
    <button v-if="step !== 'welcome' && !busy" class="back-btn" aria-label="Back" @click="back">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <path d="M39 20C39 19.6516 39 19.4775 38.9784 19.3315C38.8491 18.4601 38.1649 17.7759 37.2935 17.6466C37.1475 17.625 36.9734 17.625 36.625 17.625H19.7531C15.6432 17.625 13.5883 17.625 13.0769 16.3904C12.5655 15.1557 14.0186 13.7027 16.9247 10.7966L21.6862 6.03501C21.9342 5.78703 22.0582 5.66305 22.1465 5.54379C22.6715 4.83467 22.6698 3.86531 22.1423 3.15805C22.0536 3.03911 21.9291 2.91556 21.6803 2.66846C21.433 2.42292 21.3094 2.30016 21.1904 2.2126C20.4832 1.69217 19.5193 1.69387 18.8139 2.2168C18.6952 2.30477 18.572 2.42798 18.3256 2.67439L3.82843 17.1716C2.49509 18.5049 1.82843 19.1716 1.82843 20C1.82843 20.8284 2.49509 21.4951 3.82843 22.8284L18.3249 37.3249C18.5672 37.5672 18.6884 37.6884 18.8048 37.7752C19.514 38.3037 20.486 38.3037 21.1952 37.7752C21.3116 37.6884 21.4328 37.5672 21.6751 37.3249C21.9173 37.0827 22.0384 36.9616 22.1251 36.8453C22.6534 36.1366 22.6538 35.1652 22.1262 34.4561C22.0396 34.3397 21.9186 34.2185 21.6766 33.9761L16.9099 29.2009C14.0096 26.2954 12.5594 24.8426 13.0712 23.6088C13.5829 22.375 15.6355 22.375 19.7409 22.375H36.625C36.9734 22.375 37.1475 22.375 37.2935 22.3534C38.1649 22.2241 38.8491 21.5399 38.9784 20.6685C39 20.5225 39 20.3484 39 20Z" />
      </svg>
    </button>

    <!-- 1. Welcome -->
    <div v-if="step === 'welcome'" class="setup-step">
      <tiri-logo />
      <h2>Welcome to Tiri Vault</h2>
      <p class="description">
        Your files are encrypted on this computer and stored on Filecoin. Your account is a crypto wallet:
        it pays for storage and holds the keys to your files. Nobody else, Tiri included, can open them.
      </p>
      <div class="choice-grid">
        <button class="choice-button" data-test="create" @click="startCreate">
          <div class="choice-title">Create a new wallet</div>
          <div class="choice-text">First time here. You'll get a 12-word recovery phrase to keep safe.</div>
        </button>
        <button class="choice-button" data-test="import" @click="go('import')">
          <div class="choice-title">I already have a wallet</div>
          <div class="choice-text">Sign in with your recovery phrase (12 or 24 words), e.g. on a second computer.</div>
        </button>
      </div>
    </div>

    <!-- 2a. Show the new recovery phrase -->
    <div v-else-if="step === 'show-seed'" class="setup-step">
      <h2>Your recovery phrase</h2>
      <p class="description">
        Write these 12 words down on paper, in order, and keep them somewhere safe. They are the only way to get your
        files and funds back on a new computer or if you forget your password.
      </p>
      <div class="warning-box">
        Anyone with these words controls your wallet and can open your files. Tiri can't recover them for you.
        Don't store them in email, chat or screenshots.
      </div>
      <div class="word-grid" data-test="words">
        <div v-for="(w, i) in words" :key="i" class="word"><span class="n">{{ i + 1 }}</span>{{ w }}</div>
      </div>
      <div class="control">
        <input id="chkWritten" v-model="writtenDown" type="checkbox" />
        <label for="chkWritten">I wrote the 12 words down and stored them safely</label>
      </div>
      <div class="buttons">
        <button class="btn btn-success btn-inline" :disabled="!writtenDown" @click="startConfirm">Next</button>
      </div>
    </div>

    <!-- 2b. Confirm three words -->
    <div v-else-if="step === 'confirm-seed'" class="setup-step">
      <h2>Check your recovery phrase</h2>
      <p class="description">To make sure you wrote it down correctly, enter these words from your phrase.</p>
      <div v-for="(idx, k) in confirmIdx" :key="idx" class="control">
        <label :for="'confirm' + k">Word #{{ idx + 1 }}</label>
        <input
          :id="'confirm' + k"
          v-model="confirmInput[k]"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          :data-test="'confirm-' + k"
        />
      </div>
      <div v-if="confirmTouched && !confirmOk" class="error-text">
        One or more words don't match. Check your written copy.
      </div>
      <div class="buttons">
        <button class="btn btn-success btn-inline" :disabled="!confirmComplete" @click="checkConfirm">Next</button>
      </div>
    </div>

    <!-- 3. Import an existing phrase -->
    <div v-else-if="step === 'import'" class="setup-step">
      <h2>Sign in with your recovery phrase</h2>
      <p class="description">
        Enter the 12 or 24 words of your recovery phrase, separated by spaces. They stay on this computer.
      </p>
      <div class="control">
        <label for="phrase">Recovery phrase</label>
        <textarea
          id="phrase"
          v-model="importText"
          rows="4"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          data-test="phrase"
        />
      </div>
      <div v-if="importText.trim()" :class="importCheck.ok ? 'ok-text' : 'hint'" data-test="phrase-status">
        {{ importMessage }}
      </div>
      <div v-if="importAddress" class="hint">
        Wallet: <span class="address">{{ importAddress }}</span>
      </div>
      <div class="buttons">
        <button class="btn btn-success btn-inline" :disabled="!importCheck.ok" @click="go('password')">Next</button>
      </div>
    </div>

    <!-- 4. Password for this computer -->
    <div v-else-if="step === 'password'" class="setup-step">
      <h2>Set an unlock password</h2>
      <p class="description">
        This password unlocks Tiri Vault on this computer, so you don't have to type the recovery phrase each time.
        It is never sent anywhere. If you forget it, sign in again with your recovery phrase.
      </p>
      <div class="control">
        <label for="pw1">Unlock password</label>
        <input id="pw1" v-model="password" type="password" autocomplete="new-password" data-test="pw1" />
      </div>
      <div class="control">
        <label for="pw2">Confirm password</label>
        <input id="pw2" v-model="password2" type="password" autocomplete="new-password" data-test="pw2" />
        <div v-if="password && password.length < MIN_PASSWORD_LENGTH" class="hint">
          At least {{ MIN_PASSWORD_LENGTH }} characters.
        </div>
        <div v-else-if="password2 && password !== password2" class="error-text">The passwords don't match.</div>
      </div>
      <div class="control">
        <label for="device">Name of this computer</label>
        <input id="device" v-model="device" type="text" maxlength="40" data-test="device" />
        <div class="hint">Helps you tell your devices apart, e.g. in names of conflicting file copies.</div>
      </div>
      <div v-if="error" class="error-text">{{ error }}</div>
      <div class="buttons">
        <button class="btn btn-success btn-inline" :disabled="!passwordOk || busy" data-test="finish" @click="finish">
          {{ busy ? 'Encrypting…' : mode === 'create' ? 'Create wallet' : 'Sign in' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import TiriLogo from '~/components/TiriLogo.vue'
import { checkMnemonic, keysFromMnemonic, newMnemonic, normalizeMnemonic, wipeKeys } from '~/tiri/keys'
import { MIN_PASSWORD_LENGTH } from '~/tiri/vault'
import { useTiriStore } from '~/store/tiri'

type Step = 'welcome' | 'show-seed' | 'confirm-seed' | 'import' | 'password'

const tiri = useTiriStore()
const step = ref<Step>('welcome')
const history: Step[] = []
const mode = ref<'create' | 'import'>('create')

const mnemonic = ref('')
const words = computed(() => mnemonic.value.split(' ').filter(Boolean))
const writtenDown = ref(false)

const confirmIdx = ref<number[]>([])
const confirmInput = ref<string[]>(['', '', ''])
const confirmTouched = ref(false)

const importText = ref('')
const importAddress = ref('')

const password = ref('')
const password2 = ref('')
const device = ref(defaultDeviceName())
const busy = ref(false)
const error = ref('')

function go(next: Step) {
  history.push(step.value)
  if (next === 'import') mode.value = 'import'
  step.value = next
}

function back() {
  const prev = history.pop()
  if (!prev) return
  if (prev === 'welcome') {
    // Leaving the flow: forget everything typed or generated so far.
    mnemonic.value = ''
    writtenDown.value = false
    importText.value = ''
    password.value = password2.value = ''
  }
  error.value = ''
  step.value = prev
}

function startCreate() {
  mode.value = 'create'
  mnemonic.value = newMnemonic()
  writtenDown.value = false
  go('show-seed')
}

function startConfirm() {
  const picks = new Set<number>()
  const rnd = new Uint32Array(1)
  while (picks.size < 3) {
    crypto.getRandomValues(rnd)
    picks.add(rnd[0] % words.value.length)
  }
  confirmIdx.value = [...picks].sort((a, b) => a - b)
  confirmInput.value = ['', '', '']
  confirmTouched.value = false
  go('confirm-seed')
}

const confirmComplete = computed(() => confirmInput.value.every((w) => w.trim().length > 0))
const confirmOk = computed(() =>
  confirmIdx.value.every((idx, k) => normalizeMnemonic(confirmInput.value[k]) === words.value[idx]),
)

function checkConfirm() {
  confirmTouched.value = true
  if (confirmOk.value) go('password')
}

const importCheck = computed(() => checkMnemonic(importText.value))
const importMessage = computed(() => {
  const c = importCheck.value
  if (c.ok) return `Valid ${c.words}-word recovery phrase.`
  if (c.reason === 'count') return `${c.words} words so far. A recovery phrase has 12 or 24 words.`
  if (c.reason === 'unknown-words') return `Not in the recovery-phrase word list: ${c.unknown?.join(', ')}`
  return 'These words don\'t form a valid recovery phrase. Check for a typo or a word in the wrong place.'
})

// Show which wallet the phrase opens, so the user can recognise it before continuing.
watch(importText, async () => {
  importAddress.value = ''
  if (!importCheck.value.ok) return
  const text = importText.value
  const keys = await keysFromMnemonic(text)
  if (text === importText.value) importAddress.value = keys.account.address
  wipeKeys(keys)
})

const passwordOk = computed(
  () =>
    password.value.length >= MIN_PASSWORD_LENGTH &&
    password.value === password2.value &&
    device.value.trim().length > 0,
)

async function finish() {
  if (!passwordOk.value || busy.value) return
  busy.value = true
  error.value = ''
  try {
    const phrase = mode.value === 'create' ? mnemonic.value : normalizeMnemonic(importText.value)
    await tiri.setUpWallet(phrase, password.value, device.value.trim())
    // The app switches to the main screen on its own once the wallet is unlocked.
    mnemonic.value = importText.value = password.value = password2.value = ''
  } catch (err: any) {
    console.error('wallet setup failed', err)
    error.value = err?.message ?? String(err)
  } finally {
    busy.value = false
  }
}

function defaultDeviceName(): string {
  const p = navigator.platform.toLowerCase()
  if (p.startsWith('win')) return 'Windows PC'
  if (p.startsWith('mac')) return 'Mac'
  if (p.includes('linux')) return 'Linux PC'
  return 'My computer'
}
</script>

<style lang="stylus" scoped>
@require "../styles/setup";

textarea {
  width: 100%;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
</style>

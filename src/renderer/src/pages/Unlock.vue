<template>
  <div class="setup-screen">
    <div v-if="!confirmRemove" class="setup-step">
      <tiri-logo />
      <h2>Unlock Tiri Vault</h2>
      <p class="description center">
        Wallet <span class="address">{{ shortAddress }}</span> on {{ tiri.deviceName }}
      </p>
      <form class="grid gap-4" @submit.prevent="submit">
        <div class="control">
          <label for="unlockPw">Unlock password</label>
          <input
            id="unlockPw"
            ref="pwInput"
            v-model="password"
            type="password"
            autocomplete="current-password"
            data-test="unlock-pw"
          />
        </div>
        <div v-if="error" class="error-text" data-test="unlock-error">{{ error }}</div>
        <div class="buttons">
          <button class="btn btn-success btn-inline" type="submit" :disabled="!password || busy" data-test="unlock">
            {{ busy ? 'Unlocking…' : 'Unlock' }}
          </button>
        </div>
      </form>
      <div class="buttons">
        <button class="link-button" type="button" data-test="forgot" @click="confirmRemove = true">
          Forgot your password, or want to use a different wallet?
        </button>
      </div>
    </div>

    <div v-else class="setup-step">
      <h2>Remove this wallet from this computer?</h2>
      <p class="description">
        This deletes the encrypted copy of your recovery phrase stored on this computer. Your files on Filecoin and
        the funds in your wallet are not affected.
      </p>
      <div class="warning-box">
        To use this wallet again you'll need its recovery phrase. Without it, the files and funds of
        <span class="address">{{ tiri.address }}</span> can't be recovered by anyone.
      </div>
      <div class="buttons">
        <button class="btn btn-inline" type="button" @click="confirmRemove = false">Cancel</button>
        <button class="btn btn-success btn-inline" type="button" data-test="confirm-remove" @click="remove">
          Remove from this computer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import TiriLogo from '~/components/TiriLogo.vue'
import { useTiriStore } from '~/store/tiri'
import { WrongPasswordError } from '~/tiri/vault'

const tiri = useTiriStore()
const password = ref('')
const busy = ref(false)
const error = ref('')
const confirmRemove = ref(false)
const pwInput = ref<HTMLInputElement | null>(null)

const shortAddress = computed(() => `${tiri.address.slice(0, 6)}…${tiri.address.slice(-4)}`)

onMounted(() => nextTick(() => pwInput.value?.focus()))

async function submit() {
  if (!password.value || busy.value) return
  busy.value = true
  error.value = ''
  try {
    await tiri.unlock(password.value)
    password.value = ''
  } catch (err: any) {
    error.value = err instanceof WrongPasswordError ? 'Wrong password. Try again.' : (err?.message ?? String(err))
    password.value = ''
    nextTick(() => pwInput.value?.focus())
  } finally {
    busy.value = false
  }
}

async function remove() {
  await tiri.removeWalletFromDevice()
}
</script>

<style lang="stylus" scoped>
@require "../styles/setup";

.center {
  text-align: center;
}
</style>

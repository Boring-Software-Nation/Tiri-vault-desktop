<template>
  <div class="account-page">
    <h1>Account</h1>

    <section class="card">
      <div class="card-head">
        <h3>Wallet</h3>
        <span class="badge" :class="NETWORK === 'mainnet' ? 'badge-main' : 'badge-test'">{{ NETWORK_LABEL }}</span>
      </div>
      <div class="row">
        <span class="address" data-test="address">{{ tiri.address }}</span>
        <button class="small-btn" @click="copyAddress">{{ copied ? 'Copied' : 'Copy' }}</button>
      </div>
      <p class="muted">
        This address is your Tiri account. Send {{ FIL_SYMBOL }} (network fees) and {{ USDFC_SYMBOL }} (storage) to it.
      </p>
    </section>

    <section class="card">
      <div class="card-head">
        <h3>Balance</h3>
        <button class="small-btn" :disabled="tiri.balancesLoading" @click="tiri.refreshBalances()">
          {{ tiri.balancesLoading ? 'Updating…' : 'Refresh' }}
        </button>
      </div>
      <div v-if="tiri.balances" class="balances" data-test="balances">
        <div><span class="amount">{{ tiri.balances.fil }}</span> {{ FIL_SYMBOL }}</div>
        <div><span class="amount">{{ tiri.balances.usdfc }}</span> {{ USDFC_SYMBOL }}</div>
      </div>
      <p v-else-if="tiri.balancesError" class="error-text">{{ tiri.balancesError }}</p>
      <p v-else class="muted">Loading…</p>
      <p v-if="FAUCETS.length" class="muted">
        Testnet tokens are free:
        <template v-for="(f, i) in FAUCETS" :key="f.url">
          <a :href="f.url" target="_blank" rel="noopener">{{ f.label }}</a><span v-if="i < FAUCETS.length - 1"> · </span>
        </template>
        (paste your address there).
      </p>
    </section>

    <section class="card">
      <div class="card-head">
        <h3>Tiri relay</h3>
        <span class="status" :class="'status-' + tiri.relayStatus" data-test="relay-status">{{ relayLabel }}</span>
      </div>
      <p v-if="tiri.relayStatus === 'error'" class="error-text">{{ tiri.relayError }}</p>
      <p class="muted">
        The relay keeps your devices in sync. It never sees your files or their names.
        <template v-if="tiri.session"> Session valid until {{ new Date(tiri.session.expiresAt).toLocaleDateString() }}.</template>
      </p>
      <button v-if="tiri.relayStatus === 'error'" class="small-btn" @click="tiri.signIn()">Retry</button>
    </section>

    <section class="card">
      <div class="card-head">
        <h3>This computer</h3>
      </div>
      <p class="muted">Name: {{ tiri.deviceName }}</p>
      <button class="small-btn" data-test="lock" @click="tiri.lock()">Lock</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTiriStore } from '~/store/tiri'
import { FAUCETS, FIL_SYMBOL, NETWORK, NETWORK_LABEL, USDFC_SYMBOL } from '~/tiri/chain'

const tiri = useTiriStore()
const copied = ref(false)

const relayLabel = computed(
  () =>
    ({
      'signed-in': 'Connected',
      'signing-in': 'Signing in…',
      'signed-out': 'Not connected',
      error: 'Not connected',
    })[tiri.relayStatus],
)

async function copyAddress() {
  await navigator.clipboard.writeText(tiri.address)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<style lang="stylus" scoped>
@require "../styles/vars";

.account-page {
  padding: 32px 40px;
  max-width: 760px;
  display: grid;
  gap: 16px;
  height: 100%;
  overflow-y: auto;
  align-content: start;
}

h1 {
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 700;
  color: #D06B57;
}

.card {
  background: bg-accent;
  border-radius: 10px;
  padding: 16px 18px;
  display: grid;
  gap: 10px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #3d3a36;
  }
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.address {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 14px;
  word-break: break-all;
  color: #1d1b20;
}

.muted {
  margin: 0;
  font-size: 13px;
  line-height: 18px;
  color: #4a453f;

  a {
    color: #2e6f8e;
    text-decoration: underline;
  }
}

.error-text {
  margin: 0;
  font-size: 13px;
  color: #b3412c;
}

.balances {
  display: flex;
  gap: 32px;
  font-size: 14px;
  color: #3d3a36;

  .amount {
    font-size: 22px;
    font-weight: 700;
    color: #1d1b20;
  }
}

.small-btn {
  justify-self: start;
  padding: 5px 12px;
  border-radius: 6px;
  border: 2px solid #568BA4;
  background: #F4EEE6;
  color: #2e6f8e;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
}

.badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.badge-test {
  background: #f6dfa6;
  color: #6b4e00;
}

.badge-main {
  background: #cfe8d9;
  color: #1f5c3b;
}

.status {
  font-size: 13px;
  font-weight: 600;
}

.status-signed-in {
  color: #2f7a52;
}

.status-signing-in {
  color: #6b4e00;
}

.status-error, .status-signed-out {
  color: #b3412c;
}
</style>

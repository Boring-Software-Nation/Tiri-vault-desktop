<template>
  <div class="page page-unlock">
    <div class="page-content">
      <div class="page-icon"><font-awesome-icon icon="exclamation-triangle" /></div>
      <template v-if="unavailable === 'ofac blocked'">
        <h2 class="text-center text-warning">{{ 'Wallet Access Limited' }}</h2>
        <p>{{ "Due to a recent settlement between the United States of America's Office of Foreign Asset Control and BitGo, Inc, Sia Central has decided to prevent sending transactions in our non-custodial lite wallet from certain countries. Our lite wallet does not have user accounts and all wallet data is managed and stored locally on your device. However, it is our understanding of the current regulations that we are required to prevent transactions originating in certain countries sanctioned by the U.S. government from being broadcast through our node." }}</p>
        <p>{{ "We did not make this change lightly and are still researching compliance requirements in an ever changing regulatory climate. If you believe you have received this message in error, please reach out via email, Github, or in the official Sia Discord." }}</p>
        <div>
          <h4>Resources:</h4>
          <ul>
            <li><a href="https://home.treasury.gov/policy-issues/financial-sanctions/sanctions-programs-and-country-information" target="_blank">US Department of the Treasury Sanctions Information</a></li>
            <li><a href="https://home.treasury.gov/policy-issues/financial-sanctions/recent-actions/20201230_33" target="_blank">US Department of the Treasury vs BitGo, Inc Settlement Agreement</a></li>
          </ul>
          <h4>Contact:</h4>
          <ul>
            <li><a href="https://discord.gg/sia" target="_blank">{{ 'Sia Discord' }}</a></li>
            <li><a href="https://github.com/siacentral/sia-lite-wallet-web/issues" target="_blank">{{ 'GitHub' }}</a></li>
            <li><a href="mailto:hi@siacentral.com?subject=OFAC Blocked" target="_blank">hi@siacentral.com</a></li>
          </ul>
        </div>
      </template>
      <template v-else>

      </template>
      <div class="text-center">
        <button class="btn btn-success btn-inline btn-warning" @click="setUnavailable(null)">{{ "Confirm" }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'UnavailablePage',
};
</script>


<script setup lang="ts">
import {useWalletsStore} from "~/store/wallet";

const { unavailable, setUnavailable } = useWalletsStore()
</script>

<style lang="stylus" scoped>
@require "../styles/vars";

.page-unlock {
  position: fixed;
  background: bg-dark;
  z-index: 99;
}

h2, p {
  margin: 0;
}

.page-icon {
  text-align: center;
  color: warning-accent;

  svg {
    width: 48px;
    height: auto;
  }
}

.btn.btn-inline {
  margin-right: 0;
}

.page-content {
  display: grid;
  height: 100%;
  max-width: 700px;
  margin: auto;
  padding: 15px;
  grid-gap: 30px;
  align-content: safe center;
  overflow-x: hidden;
  overflow-y: auto;
}

.text-secondary {
  color: rgba(255, 255, 255, 0.24);
}
</style>

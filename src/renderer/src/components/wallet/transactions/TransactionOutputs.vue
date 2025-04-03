<template>
  <div class="transaction-outputs">
    <table>
      <tr class="header" v-if="inputs && inputs.length !== 0"><td colspan="5">{{ 'Inputs' }}</td></tr>
      <siacoin-output-list v-if="inputs && inputs.length !== 0" :wallet="wallet" :outputs="inputs" />
      <tr class="header" v-if="outputs && outputs.length !== 0"><td colspan="5">{{ 'Outputs' }}</td></tr>
      <siacoin-output-list v-if="outputs && outputs.length !== 0" :wallet="wallet" :outputs="outputs" />
    </table>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TransactionOutputs',
};
</script>

<script setup lang="ts">
import SiacoinOutputList from "~/components/wallet/transactions/SiacoinOutputList.vue";
import Wallet from "~/types/wallet";
import {useWalletsStore} from "~/store/wallet";
import BigNumber from 'bignumber.js';
import { formatPriceString } from '~/utils/format';
import {storeToRefs} from "pinia";
import { computed } from "vue";

const props = defineProps<{
  transaction: any,
  wallet: Wallet
}>();

const { settings, exchangeRateSC, siaNetworkFees } = storeToRefs(useWalletsStore())

const networkFees = computed(() => {
  // if (props.wallet && props.wallet.currency === 'scp')
  //   return scprimeNetworkFees.value;

  return siaNetworkFees.value;
})

const outputs = computed(() => {
  if (!props.transaction || !Array.isArray(props.transaction.siacoin_outputs))
    return [];

  return props.transaction.siacoin_outputs;
});

const inputs = computed(() => {
  if (!props.transaction || !Array.isArray(props.transaction.siacoin_inputs))
    return [];

  return props.transaction.siacoin_inputs;
});

const getOutputSC = (recipient) => {
  const siacoins = formatPriceString(new BigNumber(recipient.value), 2, props.wallet.currency, 1, props.wallet.precision());

  return `${siacoins.value} <span class="currency-display">${siacoins.label}</span>`;
}

const getOutputCurrency = (recipient) => {
  let exchangeRate = exchangeRateSC.value;

  // if (props.wallet.currency && props.wallet.currency === 'scp')
  //   exchangeRate = exchangeRateSCP.value;

  const currency = formatPriceString(new BigNumber(recipient.value), 2, settings?.value?.currency, exchangeRate, props.wallet.precision());

  return `${currency.value} <span class="currency-display">${currency.label}</span>`;
}

</script>

<style lang="stylus">
@require "../../../styles/vars";
.transaction-outputs.transaction-outputs {
  padding: 7px;
  background: bg;
  overflow: hidden;

  table tbody tr {
    background: bg;
  }

  tr.header {
    td {
      text-align: left;
      color: rgba(255, 255, 255, 0.54);
      z-index: 5;
    }
  }
}
body.dark {
  .transaction-outputs.transaction-outputs {
    background: bg-dark;

    table tbody tr {
      background: bg-dark;
    }
  }
}
</style>

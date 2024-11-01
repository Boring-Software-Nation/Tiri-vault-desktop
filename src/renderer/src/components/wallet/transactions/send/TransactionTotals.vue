<template>
  <div class="transaction-totals">
    <template v-if="mode === 'outputs'">
      <div>{{ 'Miner Fee' }}</div>
      <div class="text-right" v-html="getSiacoin(minerFees)" />
      <div class="text-right" v-html="getCurrency(minerFees)" />
    </template>
    <template v-else>
      <div>{{ 'Transaction Fee' }}</div>
      <div class="text-right" v-html="getSiacoin(fees)" />
      <div class="text-right" v-html="getCurrency(fees)" />
    </template>
    <div class="divider" />
    <div>{{ 'Spent' }}</div>
    <div class="text-right" v-html="getSiacoin(spentAmount)" />
    <div class="text-right" v-html="getCurrency(spentAmount)" />
    <div>{{ 'Remaining Balance' }}</div>
    <div class="text-right" v-html="getSiacoin(walletBalance)" />
    <div class="text-right" v-html="getCurrency(walletBalance)" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'TransactionTotals',
};
</script>


<script setup lang="ts">
  import Wallet from "~/types/wallet";
  import {useWalletsStore} from "~/store/wallet";
  import {storeToRefs} from "pinia";
  import BigNumber from "bignumber.js";
  import {formatPriceString} from "~/utils/format";
  import { computed } from "vue";

  const props = defineProps<{
    transaction: any,
    wallet: Wallet,
    mode: String
  }>();

  const { settings, exchangeRateSC, siaNetworkFees } = storeToRefs(useWalletsStore())

  const networkFees = computed(() => {
    // if (props.wallet && props.wallet.currency === 'scp')
    //   return scprimeNetworkFees.value;

    return siaNetworkFees.value;
  })

  const walletBalance = computed(() => {
    if (!props.wallet || !props.transaction)
      return new BigNumber(0);

    return props.wallet.unconfirmedSiacoinBalance().minus(inputAmount.value).plus(receiveAmount.value);
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

  const inputAmount = computed(() => {
    return inputs.value.reduce((total, o) => {
      const value = total.plus(o.value);

      if (value.isNaN() || !value.isFinite())
        return total;

      return value;
    }, new BigNumber(0));
  })

  const receiveAmount = computed(() => {
    return outputs.value.reduce((total, o) => {
      if (!o.owned)
        return total;

      const value = total.plus(o.value);

      if (value.isNaN() || !value.isFinite())
        return total;

      return value;
    }, new BigNumber(0));
  })

  const spentAmount = computed(() => {
    return inputAmount.value.minus(receiveAmount.value);
  })

  const minerFees = computed(() => {
    if (!props.transaction || !Array.isArray(props.transaction.miner_fees))
      return new BigNumber(0);

    return props.transaction.miner_fees.reduce((total, f) => {
      const value = total.plus(f);

      if (value.isNaN() || !value.isFinite())
        return total;

      return value;
    }, new BigNumber(0));
  })

  const apiFee = computed(() => {
    return outputs.value.reduce((total, o) => {
      if (o.tag !== 'Broadcast Fee')
        return total;

      const value = total.plus(o.value);

      if (value.isNaN() || !value.isFinite())
        return total;

      return value;
    }, new BigNumber(0));
  })

  const fees = computed(() => {
    return apiFee.value.plus(minerFees.value);
  })

  const getSiacoin = (value: BigNumber) => {
    const siacoins = formatPriceString(new BigNumber(value), 2, props.wallet.currency, 1, props.wallet.precision());

    return `${siacoins.value} <span class="currency-display">${props.wallet.currency}</span>`;
  }

  const getCurrency = (value: BigNumber) => {
    let exchangeRate = exchangeRateSC.value;

    // if (props.wallet.currency && props.wallet.currency === 'scp')
    //   exchangeRate = exchangeRateSCP.value;

    const currency = formatPriceString(new BigNumber(value), 2, settings?.value?.currency, exchangeRate[settings?.value?.currency||''], props.wallet.precision());

    return `${currency.value} <span class="currency-display">${currency.label}</span>`;
  }


</script>

<style lang="stylus" scoped>
@require "../../../../styles/vars";

.transaction-totals {
  display: grid;
  grid-template-columns: minmax(0, 1fr) repeat(2, auto);
  grid-gap: 10px;
  margin-bottom: 15px;

  .divider {
    width: 100%;
    height: 1px;
    grid-column: 1 / -1;
    background: dark-gray;
    margin: 5px 0;
  }
}
</style>

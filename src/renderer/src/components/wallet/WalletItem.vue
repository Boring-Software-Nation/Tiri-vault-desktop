<template>
  <div :class="{ 'wallet': true, 'active-wallet': active }">
    <div class="wallet-name">{{ wallet.title || 'Wallet' }}</div>
    <div class="wallet-balance" v-html="displaySiacoins"></div>
    <div class="wallet-balance" v-if="walletSiafundBalance.gt(0)" v-html="displaySiafunds"></div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'WalletItem',
};
</script>

<script setup lang="ts">
  import BigNumber from 'bignumber.js';
  import { formatPriceString, formatSiafundString } from '~/utils/format.js';
  import {computed} from "vue";
  import {useWalletsStore} from "~/store/wallet";
  import Wallet from "~/types/wallet.js";

  const { exchangeRateSC, exchangeRateSF} = useWalletsStore()

  const props = defineProps<{
    wallet: Wallet,
    active: Boolean
  }>();

  const walletBalance = computed(() => {
    let value = new BigNumber(0);

    if (props.wallet)
      value = props.wallet.unconfirmedSiacoinBalance();

    return value;
  });

  const walletSiafundBalance = computed(() => {
    let value = new BigNumber(0);

    if (props.wallet)
      value = props.wallet.unconfirmedSiafundBalance();

    return value;
  });

  const displaySiacoins = computed(() => {
    const siacoins = formatPriceString(new BigNumber(walletBalance.value), 2, props.wallet.currency, 1, props.wallet.precision());

    return `${siacoins.value} <span class="currency-display">${siacoins.label}</span>`;
  });

  const displaySiafunds = computed(() => {
    const { value, label } = formatSiafundString(new BigNumber(walletSiafundBalance.value), props?.wallet.currency);

    return `${value} <span class="currency-display">${label}</span>`;
  });

  const displayCurrency = computed(() => {
    let exchangeRate = exchangeRateSC;

    // if (props.wallet.currency && props.wallet.currency === 'scp')
    //   exchangeRate = exchangeRateSCP;

    const currency = formatPriceString(new BigNumber(walletBalance.value), 2, props.wallet.currency, exchangeRate[props.wallet.currency], props.wallet.precision());

    return `${currency.value} <span class="currency-display">${currency.label}</span>`;
  });

</script>

<style lang="stylus" scoped>
@require "../../styles/vars";
.wallet {
  position: relative;
  font-size: 1rem;
  text-align: right;
  padding: 15px;
  transition: all 0.3s linear;
  cursor: pointer;
  overflow: hidden;

  .wallet-name {
    font-size: 1.2rem;
    margin-bottom: 3px;
    color: rgba(255, 255, 255, 0.75);
  }

  .wallet-balance {
    color: rgba(255, 255, 255, 0.54);
  }

  &.active-wallet, &:hover, &:focus {
    .wallet-name {
      color: primary;
    }

    .wallet-balance {
      color: rgba(255, 255, 255, 0.75);
    }
  }
}
</style>

<template>
  <tbody>
  <tr v-for="(output, i) in outputs" :key="i">
    <td class="fit-text icon">
      <identicon :value="output.unlock_hash" />
    </td>
    <td>
      <input class="output-address" :value="output.unlock_hash" readonly />
    </td>
    <td  class="fit-text text-center">
      <span class="tag">{{ output.tag }}</span>
    </td>
    <td class="fit-text text-right" v-html="getOutputSC(output)" />
    <td class="fit-text text-right" v-html="getOutputCurrency(output)" />
  </tr>
  </tbody>
</template>

<script lang="ts">
export default {
  name: 'SiacoinOutputList',
};
</script>


<script setup lang="ts">
import Identicon from "~/components/wallet/Identicon.vue";
import {useWalletsStore} from "~/store/wallet";
import Wallet from "~/types/wallet";
import BigNumber from 'bignumber.js';
import { formatPriceString } from '~/utils/format';
import {storeToRefs} from "pinia";

const { exchangeRateSC, settings, } = storeToRefs(useWalletsStore())

const props = defineProps<{
  //title: String,
  outputs: Array<any>,
  wallet: Wallet
}>();


const getOutputSC = (output) => {
  const siacoins = formatPriceString(new BigNumber(output.value), 2, props.wallet.currency, 1, props.wallet.precision());

  return `${siacoins.value} <span class="currency-display">${siacoins.label}</span>`;
}

const getOutputCurrency = (output) => {
  let exchangeRate = exchangeRateSC.value;

  // if (props.wallet.currency && props.wallet.currency === 'scp')
  //   exchangeRate = exchangeRateSCP;

  const currency = formatPriceString(new BigNumber(output.value), 2, settings?.value?.currency, exchangeRate[settings?.value?.currency||''], props.wallet.precision());

  return `${currency.value} <span class="currency-display">${currency.label}</span>`;
}

</script>

<style lang="stylus" scoped>
@require "../../../styles/vars";

.output-title {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.54);
  grid-column: 1 / -1;
}

tbody tr td {
  padding: 8px;
}

.tag {
  display: inline-block;
  padding: 4px 8px;
  text-align: center;
  background: #383838;
  border-radius: 50px;
  font-size: 0.8rem;
}

.output-address {
  display: block;
  width: 100%;
  background: none;
  color: rgba(255, 255, 255, 0.54);
  font-size: 1.2rem;
  outline: none;
  border: none;
  text-overflow: ellipsis;
}

.icon {
  font-size: 0;

  .identicon {
    width: 48px;
    height: auto;
  }
}
</style>

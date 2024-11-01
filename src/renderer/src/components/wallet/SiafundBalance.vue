<template>
  <div class="wallet-display-balance" >
    <div>
      {{ formattedSiafunds.value }} <span class="currency-display">{{ formattedSiafunds.label }}</span>
    </div>
    <div class="claim-sub">
      {{ formattedClaim.value }} <span class="currency-display">{{ formattedClaim.label }}</span> dividend)
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SiafundBalance',
};
</script>


<script setup lang="ts">
  import { formatPriceString, formatSiafundString } from '~/utils/format';
  import Wallet from "~/types/wallet";
  import { computed } from 'vue';

  const props = defineProps<{
    siafunds: any,
    claim: any,
    wallet: Wallet
  }>();

  const formattedSiafunds = computed(() => {
    return formatSiafundString(props.siafunds, props.wallet.currency);
  })
  const formattedClaim = computed(() => {
    return formatPriceString(props.claim, 2, props.wallet.currency, 1, props.wallet.precision());
  })


</script>

<style lang="stylus" scoped>
.claim-sub {
  font-size: 0.5em;
}
</style>

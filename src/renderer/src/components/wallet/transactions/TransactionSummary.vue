<template>
  <div class="transaction-summary">
    <div class="transaction-outputs">
      <table>
        <siacoin-output-list v-if="direction === 'send'" :wallet="wallet" :outputs="recipients" />
        <siacoin-output-list v-else :wallet="wallet" :outputs="received" />
      </table>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TransactionSummary',
};
</script>


<script setup lang="ts">
  import SiacoinOutputList from "~/components/wallet/transactions/SiacoinOutputList.vue";

  import Wallet from "~/types/wallet";
  import {useWalletsStore} from "~/store/wallet";
  import BigNumber from 'bignumber.js';
  import {storeToRefs} from "pinia";
  import { computed } from "vue";

  const props = defineProps<{
    wallet: Wallet,
    transaction: any,
  }>();

  const { settings, exchangeRateSC, feeAddresses } = storeToRefs(useWalletsStore())

  const direction = computed(() => {
    return input.value.gt(output.value) ? 'send' : 'receive';
  })

  const value = computed(() => {
    if (!props.transaction || !Array.isArray(props.transaction.siacoin_inputs))
      return new BigNumber(0);

    return props.transaction.siacoin_outputs.reduce((total, o) => {
      if (!o.owned)
        return total;

      return total.plus(o.value);
    }, new BigNumber(0));
  })

  const input = computed(() => {
    if (!props.transaction || !Array.isArray(props.transaction.siacoin_inputs))
      return new BigNumber(0);

    return props.transaction.siacoin_inputs.reduce((total, o) => {
      if (!o.owned)
        return total;

      return total.plus(o.value);
    }, new BigNumber(0));
  })

  const output = computed(() => {
    if (!props.transaction || !Array.isArray(props.transaction.siacoin_outputs))
      return new BigNumber(0);

    return props.transaction.siacoin_outputs.reduce((total, o) => {
      if (!o.owned)
        return total;

      return total.plus(o.value);
    }, new BigNumber(0));
  })

  const recipients = computed(() => {
    if (!props.transaction || !Array.isArray(props.transaction.siacoin_outputs))
      return [];

    return props.transaction.siacoin_outputs.reduce((outputs, o) => {
      if (o.owned || feeAddresses.value.indexOf(o.unlock_hash as never) !== -1)
        return outputs;

      const i = outputs.findIndex(a => a.unlock_hash === o.unlock_hash);

      if (i !== -1)
        outputs[i].value = outputs[i].value.plus(o.value);
      else {
        outputs.push({
          ...o,
          tag: getOutputTag(o)
        });
      }

      return outputs;
    }, []);
  })

  const received = computed(() => {
    if (!props.transaction || !Array.isArray(props.transaction.siacoin_outputs))
      return [];

    return props.transaction.siacoin_outputs.reduce((outputs, o) => {
      if (!o.owned)
        return outputs;

      const i = outputs.findIndex(a => a.unlock_hash === o.unlock_hash);

      if (i !== -1)
        outputs[i].value = outputs[i].value.plus(o.value);
      else {
        outputs.push({
          ...o,
          tag: getOutputTag(o)
        });
      }

      return outputs;
    }, []);
  })

  const getOutputTag = (recipient) => {
    if (output.value.owned)
      return 'Received';

    if (feeAddresses.value.indexOf(output.value.unlock_hash as never) !== -1)
      return 'Broadcast Fee';

    return 'Recipient';
  }

  const getInputTag = (output) => {
    if (output.owned.value)
      return 'Sent';

    if (feeAddresses.value.indexOf(output.unlock_hash as never) !== -1)
      return 'Broadcast Fee';

    return 'Sender';
  }


</script>


<style lang="stylus" scoped>
@require "../../../styles/vars";
.transaction-outputs.transaction-outputs {
  padding: 7px;
  background: bg-dark;
  overflow: hidden;

  table tbody tr {
    background: bg-dark;
  }
}
</style>

<template>
  <modal @close="$emit('close')" :overflow-hidden="true">
    <div class="text-center text-[#19cf86] text-2xl">Payment in progress...</div>
    <transition name="fade-top" mode="out-in" appear>
      <transaction-setup class="transaction-step" :wallet="wallet" :subscription="subscription" v-if="step === 'setup'" key="setup" @built="onTransactionBuilt" @done="$emit('close')"/>
      <transaction-verify class="transaction-step" :wallet="wallet" :transaction="transaction" :subscription="subscription" v-else-if="step === 'verify'" key="verify" @done="$emit('close')" />
    </transition>
  </modal>
</template>

<script lang="ts">
export default {
  name: 'SendSiacoinModal',
};
</script>


<script setup lang="ts">
  import Modal from "~/components/wallet/modals/Modal.vue";
  import TransactionSetup from "~/components/wallet/transactions/send/TransactionSetup.vue";
  import TransactionVerify from "~/components/wallet/transactions/send/TransactionVerify.vue";
  import Wallet from "~/types/wallet";
  import {useWalletsStore} from "~/store/wallet";
  import { onMounted, ref } from "vue";

  const props = defineProps<{
    wallet: Wallet,
    subscription: String
  }>();

  const { pushNotification } = useWalletsStore()

  const step = ref(''),
        transaction = ref(null as any),
        sigIndexes = ref([]);

  onMounted(() => {
    setTimeout(() => {
      step.value = 'setup';
    }, 300);

  });

  const 		onTransactionBuilt = (txn) => {
    try {
      transaction.value = txn;
      step.value = 'verify';
    } catch (ex: any) {
      console.error('onTransactionBuilt', ex);
      pushNotification({
        severity: 'danger',
        message: ex.message
      });
    }
  }
</script>

<style lang="stylus" scoped>
@require "../../../styles/vars";
.transaction-step {
  display: grid;
  height: 100%;
  align-content: safe center;
}
</style>

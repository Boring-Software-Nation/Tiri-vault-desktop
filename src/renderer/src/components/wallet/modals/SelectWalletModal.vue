<template>
  <modal @close="$emit('close')">
    <div class="wallets">
      <wallet-list class="wallets-list"
                   :wallets="wallets"
                   :active="active"
                   @selected="(i) => $emit('selected', i)" />
    </div>
  </modal>
</template>

<script lang="ts">
export default {
  name: 'SelectWalletModal',
};
</script>

<script setup lang="ts">
  import Modal from '~/components/wallet/modals/Modal.vue';
  import WalletList from '~/components/wallet/WalletList.vue';
  import Wallet from "~/types/wallet";

  const props = defineProps<{
    wallets: Wallet[],
    active: boolean | null
  }>();

  const emit = defineEmits(['close', 'selected']);


</script>

<style lang="stylus" scoped>
.wallets {
  height: 100%;
}

.wallets-list {
  height: 100%;
}
</style>

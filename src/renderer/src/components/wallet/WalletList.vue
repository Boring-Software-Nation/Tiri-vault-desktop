<template>
  <div class="wallets-list">
    <div class="wallets">
      <div class="wallet-group" v-for="group in groups" :key="group">
        <div class="group-title">{{ groupTitle(group) }}</div>
        <wallet-item
            v-for="wallet in walletGroups[group]" :key="wallet.id"
            :wallet="wallet"
            :active="wallet.id === active"
            @click.native="$emit('selected', wallet.id)" />
      </div>
    </div>


  </div>
</template>

<script lang="ts">
export default {
  name: 'WalletList',
};
</script>


<script setup lang="ts">

  import {computed} from "vue";
  import Wallet from "~/types/wallet.js";
  import WalletItem from "~/components/wallet/WalletItem.vue";

  const props = defineProps<{
    wallets: Array<Wallet>,
    active: boolean | null
  }>();

  const groups = computed(() => {
    const groups = Object.keys(walletGroups.value);
    groups.sort();

    return groups;
  });

  const walletGroups = computed(() => {
    return props?.wallets?.reduce((v, w) => {
      if (!v[w.currency])
        v[w.currency] = [];

      v[w.currency].push(w);

      return v;
    }, {});
  });

  const groupTitle = (currency) => {
    switch (currency) {
      case 'sc':
        return 'Siacoin (SC)';
      case 'scp':
        return 'ScPrimeCoin (SCP)';
      default:
        return currency;
    }
  }


</script>

<style lang="stylus" scoped>
@require "../../styles/vars";
.wallets-list {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  grid-gap: 15px;
  overflow: hidden;
  //min-width: 100px;
  max-width: 0;
}

.wallets {
  overflow-x: hidden;
  overflow-y: auto;
}

.group-title {
  padding: 8px 15px;
  color: rgba(255, 255, 255, 0.54);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.wallet-buttons {
  padding: 0 15px;
}

.btn.wallet-btn {
  display: block;
  background: transparent;
  border: 2px dashed rgba(255, 255, 255, 0.12);
  box-shadow: none;
  width: 100%;
  color: rgba(255, 255, 255, 0.54);

  &:active, &:hover, &:focus {
    color: primary;
    border-color: primary;
  }
}
</style>

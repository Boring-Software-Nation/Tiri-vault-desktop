<template>
  <div class="page wallet-page">
    <wallet-list class="wallets-list"
                 :wallets="allWallets"
                 :active="selectedWallet"
                 @selected="onWalletSelected"/>
    <div class="wallets-detail">
      <transition name="fade-top" mode="out-in">
        <wallet-transactions
            v-if="currentWallet"
            :wallet="currentWallet"
            :wallets="allWallets"
            :active="selectedWallet"
            :key="currentWallet.id"
            @selected="onWalletSelected"/>
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useWalletsStore} from "~/store/wallet";
import {computed, onMounted, ref, watchEffect} from "vue";
import WalletList from "~/components/wallet/WalletList.vue";
import {loginOrRegisterUser} from "~/services/backend";
import {useUserStore} from "~/store/user";
import {storeToRefs} from "pinia";
import WalletTransactions from "~/components/wallet/WalletTransactions.vue";

const store = useWalletsStore()
const {allWallets, pushNotification, getSelectedWallet} = store;
const { currentWallet, getCurrentWalletId } = storeToRefs(useWalletsStore())
const {user} = storeToRefs(useUserStore())
const selectedWallet = ref(null)

onMounted(() => {
  selectedWallet.value = getSelectedWallet.value || null;
})



watchEffect(async () => {
  if (!currentWallet.value)
    return;

  if (!user?.value?.token) {
    const errors = await loginOrRegisterUser(getCurrentWalletId.value, user?.value?.unlockPassword);
  }
})

const onWalletSelected = async (id) => {
  try {
    selectedWallet.value = id;
    localStorage.setItem('lastSelectedWallet', id);
  } catch (ex: any) {
    console.error('onSelectWallet', ex);
    pushNotification({
      severity: 'danger',
      message: ex.message
    });
  }
}

</script>

<style lang="stylus" scoped>
@require "../styles/vars";
.wallets-list {
  display: none;
  //border-right: 2px solid primary;
  padding-bottom: 15px;

  @media screen and (min-width: 767px) {
    display: grid;
  }
}

.page.wallet-page {
  display: grid;
  overflow: hidden;

  @media screen and (min-width: 767px) {
    grid-template-columns: auto minmax(0, 1fr);
  }
}

.wallets-detail {
  height: 100%;
  overflow: hidden;
}
</style>

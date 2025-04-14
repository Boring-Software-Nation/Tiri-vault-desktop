<template>
  <div class="page wallet-page">
    <wallet-list class="wallets-list"
                 :wallets="allWallets"
                 :active="selectedWallet"
                 @selected="onWalletSelected"/>
    <div class="wallets-detail">
      <transition name="fade-top" mode="out-in">
        <wallet-display
            v-if="currentWallet"
            :wallet="currentWallet"
            :wallets="allWallets"
            :active="true"
            :key="currentWallet.id"
            mode="wallet"
            @selected="onWalletSelected"/>
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useWalletsStore} from "~/store/wallet";
import {computed, onMounted, ref, watchEffect} from "vue";
import WalletDisplay from "~/components/wallet/WalletDisplay.vue";
import WalletList from "~/components/wallet/WalletList.vue";
import {loginOrRegisterUser} from "~/services/backend";
import {useUserStore} from "~/store/user";
import {storeToRefs} from "pinia";

const store = useWalletsStore(), userStore = useUserStore();
const { updateUser, userLogout } = userStore;
const {allWallets, pushNotification, getSelectedWallet, lockWallets} = store;
const { currentWallet, getCurrentWalletId } = storeToRefs(useWalletsStore())
const {user} = storeToRefs(userStore)
const selectedWallet = ref(null)

onMounted(() => {
  selectedWallet.value = getSelectedWallet.value || null;
})



watchEffect(async () => {
  if (!currentWallet.value)
    return;

  if (user.value && !user.value.token) {
    const errors = await loginOrRegisterUser(getCurrentWalletId.value, user.value.unlockPassword);
    if (errors && (errors as any).error && (errors as any).error.length > 0) {
      pushNotification({
        severity: 'danger',
        message: (errors as any).error[0]
      });
      logout();
    }
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

const logout = async () => {
  await userLogout()
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

.wallet-display {
  grid-gap: 0;
}

.wallets-detail {
  height: 100%;
  overflow: hidden;
}
</style>

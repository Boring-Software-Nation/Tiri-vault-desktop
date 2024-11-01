<template>
  <div class="page page-unlock">
    <div class="page-content">
      <div>
      <div class="mx-auto w-[60px] h-[60px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="61" height="60" viewBox="0 0 61 60" fill="none">
          <path d="M55.5 55L48.1514 47.6514C52.6843 43.1295 55.5 36.8932 55.5 30C55.5 16.215 44.285 5 30.5 5C16.715 5 5.5 16.215 5.5 30C5.5 43.785 16.715 55 30.5 55V50C19.4725 50 10.5 41.0275 10.5 30C10.5 18.9725 19.4725 10 30.5 10C41.5275 10 50.5 18.9725 50.5 30C50.5 35.515 48.2488 40.5068 44.626 44.126L38 37.5V55H55.5Z" fill="#19CF86"/>
        </svg>
      </div>
      <h2 class="text-center text-[12px] text-emerald-500 font-normal font-['Roboto'] leading-[20px] tracking-tight pt-[5px]">{{ 'Unlock Wallet' }}</h2>
      </div>
      <p class="text-[14px] text-[#D9D9D9] font-[Roboto] leading-[20px]">{{
          'Your Tiri vault is currently locked. Enter your password to unlock it.'
        }}</p>
      <form @submit.prevent="onUnlockWallets">
        <div class="control mb-[23px]">
          <label>{{ 'Wallet Password' }}</label>
          <input type="password" v-model="password" autocomplete="current-password" class="!border-[#938F99]"/>
        </div>

        <div v-if="false" class="w-full text-center text-zinc-300 font-normal font-['Roboto'] underline leading-tight mb-[23px] cursor-pointer" @click="forgotPassword">Reset password</div>

        <div class="buttons">
          <button class="btn btn-success btn-inline font-[Roboto]" :disabled="unlocking">{{ 'Unlock Wallet' }}</button>
          <div v-if="false" class="btn btn-outline btn-inline font-[Roboto]" @click="createNewWallet">{{ 'Create new Wallet' }}</div>
        </div>
      </form>
      <p class="text-[14px] text-[#D9D9D9] font-[Roboto] leading-[20px]">Tiri doesn't hold your password and can not change it. If you have forgotten your password,
        you can reset the Tiri vault settings and restore access to your data with your SIA wallet seed by <a @click.prevent="forgotPassword" class="text-[#BEA9EE] hover:text-[#77FF85] cursor-pointer underline">pressing here</a>.
        Before you continue make sure you remember your SIA wallet seed as once you have reset the Tiri vault,
        you won't be able to restore access with your old password (if you have remembered it), only your SIA wallet seed will unlock it.
        If you want to create a new SIA wallet with Tiri vault, <a @click.prevent="createNewWallet" class="text-[#BEA9EE] hover:text-[#77FF85] cursor-pointer underline">press here</a>.</p>

    </div>

  </div>
</template>

<script lang="ts">
export default {
  name: 'UnlockWallet',
};
</script>


<script setup lang="ts">

import {useWalletsStore} from "~/store/wallet";
import {useUserStore} from "~/store/user";
import {computed, onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import {loginOrRegisterUser} from "~/services/backend";

const store = useWalletsStore()
const userStore = useUserStore()
const {unlockWallets, pushNotification, deleteAllWallets, setSetup, setSetupMode} = store
const {wallets, currentWallet, getCurrentWalletId} = storeToRefs(store)
const {user} = storeToRefs(userStore)
const {setWasLogout} = userStore
const password = ref('')
const unlocking = ref(false)
const errors = ref()


onMounted(() => {

})


const onUnlockWallets = async () => {
  if (unlocking.value)
    return;

  unlocking.value = true;

  try {
    const unlocked = await unlockWallets(password.value);
    if (unlocked) {
      setWasLogout(false);
      errors.value = await loginOrRegisterUser(getCurrentWalletId.value, user?.value?.unlockPassword);

      pushNotification({
        icon: 'unlock',
        message: 'Welcome back to your Tiri vault!'
      });
    }
  } catch (ex) {
    pushNotification({
      severity: 'danger',
      icon: 'lock',
      message: 'Unable to decrypt wallets. Incorrect password'
    });
    console.error('onUnlockWallets', ex);
  } finally {
    unlocking.value = false;
  }
}

const createNewWallet = () => {
  deleteAllWallets();
  setSetup(false);
  setSetupMode('create-new');
}

const forgotPassword = () => {
  deleteAllWallets();
  setSetup(false);
  setSetupMode('forgot-password');
}

</script>

<style lang="stylus" scoped>
@require "../styles/vars";

.page-unlock {
  position: fixed;
  background: bg-dark;
  z-index: 99;
}

h2, p {
  margin: 0;
}

.page-icon {
  text-align: center;
  color: primary;

  svg {
    width: 48px;
    height: auto;
  }
}

.page-content {
  display: grid;
  height: 100%;
  max-width: 700px;
  margin: auto;
  padding: 15px;
  grid-gap: 23px;
  align-content: safe center;
  overflow-x: hidden;
  overflow-y: auto;
}

.text-secondary {
  color: rgba(255, 255, 255, 0.24);
}

.reset-button {
  color: rgba(255, 255, 255, 0.4);
  background: none !important;
  border: none !important;
  outline: none !important;
  cursor: pointer;
}
</style>

<template>
  <div class="page page-unlock">
    <div class="page-content">
      <div>
      <div class="mx-auto w-[60px] h-[60px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="61" height="60" viewBox="0 0 61 60" fill="none">
          <path d="M46.25 19.3333H44.625V15.0952C44.625 7.31224 38.2951 1 30.5 1C22.7049 1 16.375 7.31224 16.375 15.0952V19.3333H14.75C11.3124 19.3333 8.5 22.1361 8.5 25.5714V51.7619C8.5 55.1973 11.3124 58 14.75 58H46.25C49.6876 58 52.5 55.1973 52.5 51.7619V25.5714C52.5 22.1361 49.6876 19.3333 46.25 19.3333ZM30.5 42.9048C28.1626 42.9048 26.25 40.9932 26.25 38.6667C26.25 36.3401 28.1626 34.4286 30.5 34.4286C32.8374 34.4286 34.75 36.3401 34.75 38.6667C34.75 40.9932 32.8374 42.9048 30.5 42.9048ZM37.6375 19.3333H23.3625V15.0952C23.3625 11.1711 26.5614 7.97619 30.5 7.97619C34.4386 7.97619 37.6375 11.1711 37.6375 15.0952V19.3333Z" fill="#E4B858" stroke="#8AA8AC" stroke-width="2"/>
        </svg>
      </div>
      <h2 class="text-center">{{ 'Unlock the vault' }}</h2>
      </div>
      <p class="text-[14px] text-[#49454F] text-center">{{
          'This Tiri vault is currently locked. Enter your password to unlock it.'
        }}</p>
      <form @submit.prevent="onUnlockWallets">
        <div class="control mb-[23px]">
          <label>{{ 'Wallet Password' }}</label>
          <input class="password-input" type="password" v-model="password" autocomplete="current-password"/>
        </div>

        <div v-if="false" class="w-full text-center text-zinc-300 font-normal  underline leading-tight mb-[23px] cursor-pointer" @click="forgotPassword">Reset password</div>

        <div class="buttons">
          <button class="btn btn-success btn-inline " :disabled="unlocking">{{ 'Unlock Wallet' }}</button>
          <div v-if="false" class="btn btn-outline btn-inline " @click="createNewWallet">{{ 'Create new Wallet' }}</div>
        </div>
      </form>
      <p class="text-[14px] text-[#000]">Tiri doesn't hold your password and can not change it. If you have forgotten your password,
        you can reset the Tiri vault settings and restore access to your data with your SIA wallet seed by <a @click.prevent="forgotPassword" class="text-[#8AA8AC] cursor-pointer underline">pressing here</a>.
        Before you continue make sure you remember your SIA wallet seed as once you have reset the Tiri vault,
        you won't be able to restore access with your old password (if you have remembered it), only your SIA wallet seed will unlock it.
        If you want to create a new SIA wallet with Tiri vault, <a @click.prevent="createNewWallet" class="text-[#73B991] cursor-pointer underline">press here</a>.</p>

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
  background: bg;
  z-index: 99;
}
body.dark {
  .page-unlock {
    background: bg-dark;
  }
}

h2, p {
  margin: 0;
}

h2 {
  color: #000;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 166.667% */
  letter-spacing: 0.25px;
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

  a {
    font-weight: 600;
  }
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

.password-input {
  border-radius: 5px;
  border: 5px solid #8AA8AC;
  background: none;
}
</style>

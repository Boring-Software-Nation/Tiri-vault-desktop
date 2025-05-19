<template>
  <primary-nav />
  <div class="page-wrapper">
    <unavailable-page v-if="typeof unavailable === 'string'" />
    <router-view v-if="setup && unlocked" v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <sync v-if="setup && unlocked" v-show="routeName === 'sync'" />
    <setup-page v-else-if="!setup" />
    <unlock-wallet v-else-if="!isAuthorized" />
  </div>

  <feedback v-if="modal === 'feedback'" @close="modal = ''" />

  <notification-queue />
</template>

<script setup lang="ts">
  import {useUserStore, userStorage} from "~/store/user";
  import {routerPush} from "./router";
  import {useRoute} from "vue-router";
  import {useWalletsStore} from "./store/wallet";
  import Sync from './pages/Sync.vue'
  import UnlockWallet from "./pages/UnlockWallet.vue";
  import SetupPage from "./pages/SetupPage.vue";
  import UnavailablePage from "./pages/UnavailablePage.vue";
  import {storeToRefs} from "pinia";
  import { computed, provide, ref } from "vue";
  import PrimaryNav from "~/components/wallet/PrimaryNav.vue";
  import Feedback from "~/components/Feedback.vue";
  import NotificationQueue from "~/components/wallet/NotificationQueue.vue";
  import mitt from 'mitt';

  const userStore = useUserStore()
  const { getWasLogout } = userStore;
  const { user, isAuthorized } = storeToRefs(userStore)

  const emitter = mitt()

  const modal = ref('')

  provide('emitter', emitter);

  const walletsStore = useWalletsStore()
  const { setup, unavailable, wallets } = storeToRefs(walletsStore)
  const { lockWallets, pushNotification, settings  } = walletsStore;
  console.log('setup', setup)

  //const autoLockTimeout = ref(null)

  const unlocked = computed(() => {
    const res = Array.isArray(wallets.value) && wallets.value.length !== 0;
    console.log('unlocked', res)
    return res;
  })

  emitter.on('tdv-feedback-show', () => {
    modal.value = 'feedback';
  })

  const route = useRoute()
  const routeName = computed(() => route.name)
</script>

<style lang="stylus">
@require "./styles/global";

.titlebar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  z-index: 1000;

  button {
    display: none;
  }
}

#app {
  width: 100%;
  height: 100%;

  //@media screen and (min-width: 767px) {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
  //}
}

.page-wrapper {
  position: absolute;
  top: 0;
  left: 208px;
  right: 0;
  bottom: 0;
  width: calc(100% - 208px);
  height: 100%;
}

body.linux {
  .titlebar {
    display: none;
  }
}

body.win32 {
  .titlebar {
    height: 32px;

    button {
      display: inline-block;
      width: 46px;
      height: 32px;
      text-align: center;
      border: none;
      outline: none;
      background: none;
      font-family: "Segoe MDL2 Assets";
      font-size: 10px;
      color: rgba(255, 255, 255, 0.84);
      cursor: pointer;
      float: right;
      -webkit-app-region: none;

      &:hover, &:active, &:focus {
        color: primary;
      }
    }
  }
}
</style>

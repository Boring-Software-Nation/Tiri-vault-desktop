<template>
  <template v-if="tiri.status === 'unlocked'">
    <primary-nav />
    <div class="page-wrapper">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
    <feedback v-if="modal === 'feedback'" @close="modal = ''" />
  </template>
  <onboarding v-else-if="tiri.status === 'no-wallet'" />
  <unlock v-else-if="tiri.status === 'locked'" />

  <notification-queue />
</template>

<script setup lang="ts">
  import { provide, ref, watch } from 'vue'
  import mitt from 'mitt'
  import { useTiriStore } from '~/store/tiri'
  import { routerPush } from './router'
  import Onboarding from './pages/Onboarding.vue'
  import Unlock from './pages/Unlock.vue'
  import PrimaryNav from '~/components/wallet/PrimaryNav.vue'
  import Feedback from '~/components/Feedback.vue'
  import NotificationQueue from '~/components/wallet/NotificationQueue.vue'

  const tiri = useTiriStore()
  const emitter = mitt()
  const modal = ref('')

  provide('emitter', emitter)

  emitter.on('tdv-feedback-show', () => {
    modal.value = 'feedback'
  })

  // After unlocking or creating a wallet, start on the account screen.
  watch(
    () => tiri.status,
    (now, before) => {
      if (now === 'unlocked' && before !== 'unlocked') routerPush('home')
      if (now !== 'unlocked') modal.value = ''
    },
  )
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

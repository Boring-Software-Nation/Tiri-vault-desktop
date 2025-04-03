<template>
  <main class="px-4 py-5 h-full">
    <vue-finder id='my_vuefinder'></vue-finder>

    <div v-if="false" class="mt-2">
      <button class="btn mt-2" @click="openOptionsPage">
        Open Options
      </button>
    </div>

    <div v-if="false"  class="mt-2">
      <button class="btn mt-2" @click="openWalletsPage">
        Wallets
      </button>
    </div>

    <div v-if="false"  class="mt-2">
      <button class="btn mt-2" @click="logout">
        Logout
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">

import VueFinder from "~/components/VueFinder.vue";
import {useUserStore} from "~/store/user";
import {routerPush} from "~/router";
import {useWalletsStore} from "~/store/wallet";
const { updateUser, userLogout } = useUserStore()
const { lockWallets } = useWalletsStore()
function openOptionsPage() {
  //browser.runtime.openOptionsPage()
}
const logout = async () => {
  await userLogout()
}
const openWalletsPage = async () => {
  await routerPush('wallets')
}
</script>

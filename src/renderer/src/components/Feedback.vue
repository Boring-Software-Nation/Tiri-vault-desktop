<template>
  <div class="feedback-modal">
    <div class="feedback-modal-container">
      <button @click="$emit('close')" class="close-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#D06B57" stroke="#D06B57"/>
        </svg>
      </button>
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="66" height="68" viewBox="0 0 66 68" fill="none">
        <path d="M30.1807 5.47437C32.0885 4.55566 34.3359 4.62187 36.1953 5.67163L55.9453 16.822L56.3193 17.0496C58.1404 18.2455 59.25 20.2841 59.25 22.4822V44.5925C59.2499 46.7903 58.1401 48.8282 56.3193 50.0242L55.9453 50.2527L36.1953 61.4031C34.3359 62.4528 32.0885 62.519 30.1807 61.6003L29.8047 61.4031L10.0547 50.2527C8.01317 49.1 6.75015 46.9369 6.75 44.5925V22.4822C6.75004 20.1376 8.01308 17.9747 10.0547 16.822L29.8047 5.67163L30.1807 5.47437Z" fill="#73B991" stroke="#D06B57" stroke-width="3" stroke-linejoin="round"/>
        <path d="M8.25 19.5632L30.5418 32.1491C32.0674 33.0105 33.9326 33.0105 35.4582 32.1491L57.75 19.5632" stroke="#D06B57" stroke-width="3" stroke-linejoin="round"/>
        <path d="M33 33.5371V61.4847" stroke="#D06B57" stroke-width="3" stroke-linejoin="round"/>
      </svg>
      <div class="title">Need help?</div>
      <a class="content" :href="`mailto:tiri.support@bsn.si?subject=${subject}&body=${message}`">For support, please contact us at <span class="mailto-address">tiri.support@bsn.si</span>. Make sure to include your wallet address in the email subject field for identification.</a>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Feedback',
};
</script>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useWalletsStore } from "~/store/wallet";
import { getLastWalletAddresses, getWalletAddresses } from '~/store/db';

const walletStore = useWalletsStore();
const { currentWallet } = storeToRefs(walletStore);
const addresses = ref([]);

const subject = computed(() => {
  return encodeURIComponent(`ticket from user ID ${currentWallet.value.id}`);
});

const message = computed(() => {
  return encodeURIComponent(`My ID: ${currentWallet.value.id}\nMy wallet: ${currentAddress.value}.\nMy request: \n`);
});

const loadWalletAddresses = (page) => {
  if (!currentWallet.value.id)
    return;

  const limit = 100;

  return getLastWalletAddresses(currentWallet.value.id, limit, limit * page);
}

onBeforeMount(async () => {
  const loadedAddresses = await loadWalletAddresses(0);

  loadedAddresses.sort((a, b) => {
    if (a.index > b.index)
      return 1;

    if (a.index < b.index)
      return -1;

    return 0;
  });

  addresses.value = loadedAddresses;
});

const currentAddress = computed(() => {
  if (!Array.isArray(addresses.value) || addresses.value.length == 0 || !addresses.value[0])
    return '';

  return (addresses.value[0] as any).address;
});

</script>

<style lang="stylus" scoped>
@require "../styles/vars";

.feedback-modal {
  position: absolute;
  z-index: 2;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(228, 184, 88, 0.50);
  padding: 140px 141px 171px 142px;
}

.feedback-modal-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 5px solid #73B991;
  background: #E3CCA9;
  display: flex;
  align-items: center;
  flex-direction: column;

  .close-button {
    position: absolute;
    top: 12px;
    right: 10px;
    cursor: pointer;
  }

  .icon {
    margin-top: 36px;
    margin-bottom: 20px;
  }

  .title {
    color: #000;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; /* 142.857% */
    letter-spacing: 0.25px;
  }

  .content {
    margin-top: 20px;
    width: 468px;
    padding: 8px 12px;
    border-radius: 12px;
    background: #E4B858;
    color: #000;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 28px; /* 200% */
    text-decoration: none;
    text-align: center;
    border: 3px solid transparent;

    &:hover {
      border: 3px solid #D06B57;
    }
  }

  .mailto-address {
    color: #8AA8AC;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 28px;
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: none;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
  }
}
</style>

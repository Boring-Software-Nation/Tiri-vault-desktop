<template>
  <div class="wallet-display">
    <div class="wallet-balance" :class="{'info-only': mode === 'info-only'}">
      <div v-if="false" class="wallet-title">{{ name }}
        <button class="btn-select" @click="modal = 'wallet'">
          <font-awesome-icon icon="chevron-down"/>
        </button>
        <transition name="fade" mode="out-in">
          <div class="wallet-scanning" v-if="wallet.scanning === 'full'" key="scanning">
            <font-awesome-icon icon="arrow-rotate-right"/>
            {{ 'Scanning...' }}
          </div>
          <div class="wallet-scanning" v-else-if="walletQueued" key="queued">
            <font-awesome-icon icon="arrow-rotate-right"/>
            {{ 'Scan Queued...' }}
          </div>
        </transition>
      </div>

      <div class="flex justify-center">
        <div class="wallet-balance-c">
          <div class="wallet-balance-inner-c">
            <div><span class="wallet-siacoin-balance" v-html="formatSiacoinString(siacoinBalance)"></span><span
                class="wallet-display-balance" v-html="formatCurrencyString(siacoinBalance)"></span></div>
            <siafund-balance :siafunds="siafundBalance" :claim="claimBalance" :wallet="wallet"
                              v-if="siafundBalance.gt(0)"/>
            <div class="wallet-plan-container" v-if="subscriptionNameByCode">
              <div class="wallet-plan-row">
                <div class="wallet-plan-left">
                  <span class="wallet-plan-caption">Plan: </span><span class="wallet-plan-name">{{ subscriptionNameByCode }}</span>&nbsp;<span class="wallet-plat-vol">({{ subscriptionVolByCode }})</span>
                </div>
                <div class="wallet-plan-right" v-if="!activeSubscription.plan_code.startsWith('TRIAL')">
                  <div>
                    <span v-if="nextPaymentDate" class="wallet-plan-caption"> Expires: </span><span class="wallet-plan-name">{{ nextPaymentDate}}</span>
                  </div>
                  <div>
                    <span v-if="downgradeDate" class="wallet-plan-caption"> Downgrade: </span><span v-if="downgradeDate" class="wallet-plan-name">{{ downgradeDate}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <span class="wallet-plan-caption">No active subscription</span>
            </div>
          </div>
        </div>
      </div>


      <div class="flex justify-center mt-4" v-if="mode !== 'info-only'">
        <div class="wallet-address-outer-c">
          <div class="wallet-address-inner-c">
            <div class="wallet-address-caption">{{ formatCurrentAddress }}</div>
            <div style="width: 18px; height: 18px; position: relative; cursor: pointer;" @click="copyToClipboard">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <mask id="mask0_3022_5424" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                  <rect width="18" height="18" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_3022_5424)">
                  <path d="M14.25 14.25H6C5.5875 14.25 5.23438 14.1031 4.94063 13.8094C4.64688 13.5156 4.5 13.1625 4.5 12.75V2.25C4.5 1.8375 4.64688 1.48438 4.94063 1.19063C5.23438 0.896875 5.5875 0.75 6 0.75H11.25L15.75 5.25V12.75C15.75 13.1625 15.6031 13.5156 15.3094 13.8094C15.0156 14.1031 14.6625 14.25 14.25 14.25ZM10.5 6V2.25H6V12.75H14.25V6H10.5ZM3 17.25C2.5875 17.25 2.23438 17.1031 1.94063 16.8094C1.64688 16.5156 1.5 16.1625 1.5 15.75V5.25H3V15.75H11.25V17.25H3Z" fill="#D06B57"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div v-if="mode === 'subscription'" class="flex justify-center mt-4">
        <div style="width: 521px; height: 37px; text-align: center"><span
            style="color: #49454F; font-size: 24px; font-weight: 400; line-height: 52px;">Powerful features under </span><span
            style="color: #73B991; font-size: 24px; font-weight: 400; line-height: 52px;">subscriptions</span>
        </div>
      </div>

      <div v-if="mode === 'subscription'" class="flex justify-center mt-4">
        <div
            style="width: 531px; text-align: center; color: #49454F; font-size: 14px; font-weight: 400; line-height: 20px; letter-spacing: 0.25px;">
          Chose a plan that's right for you
        </div>
      </div>

      <div v-if="mode === 'subscription'" class="flex justify-center mt-4">
        <div class="plan-c">

          <div class="plan-col-c plan-trial" :class="{'active':activeSubscription.plan_code.startsWith('TRIAL'), 'expired':trialUsed && !activeSubscription.plan_code.startsWith('TRIAL')}">
            <div class="plan-title">{{ getNameByCode('TRIAL') }}</div>
            <div class="plan-period">for 1 month</div>
            <div class="plan-descr">Just a free trial to test functionality</div>
            <div class="plan-price" :class="{'active':activeSubscription.plan_code.startsWith('TRIAL')}">
              {{ getPriceByCode('TRIAL').value }}
            </div>
            <div class="plan-vol">{{ getVolByCode('TRIAL') }}</div>
            <div v-if="activeSubscription.plan_code.startsWith('TRIAL')" class="plan-btn-c">
              <div class="btn">{{'Active'}}</div>
            </div>
            <div v-else-if="trialUsed" class="plan-btn-c">
              <div class="btn">{{activeSubscription.plan_code ? 'Not available' : 'Trial ended'}}</div>
            </div>
            <div v-else class="plan-btn-c" @click="paySubscription('TRIAL')">
              <div class="btn">{{'Subscribe'}}</div>
            </div>
            <!-- <div
                style="left: 32px; top: 230px; position: absolute; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
              <div style="width: 18px; height: 18px; position: relative">
                <div
                    style="width: 18px; height: 18px; left: 0px; top: 0px; position: absolute; background: #D0BCFF; border-radius: 2px"></div>
                <div style="width: 15px; height: 15px; left: 2px; top: 1px; position: absolute">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M6 12.4L2 8.4L3.4 7L6 9.6L12.6 3L14 4.4L6 12.4Z" fill="#381E72"/>
                  </svg>
                </div>
              </div>
              <div class="plan-vol">{{ getVolByCode('TRIAL') }}</div>
            </div> -->
          </div>

          <div class="plan-col-c plan-medium" :class="{'active':activeSubscription.plan_code.startsWith('MEDIUM'), 'pending':downgradeDate!==''}">
            <div class="plan-title">{{ getNameByCode('MEDIUM') }}</div>
            <div class="plan-period">/month</div>
            <div class="plan-descr">Ideal for individuals who need small <br/>to store small amount <br/>of data.</div>
            <div class="plan-price" :class="{'active':activeSubscription.plan_code.startsWith('MEDIUM')}">
              {{ getPriceByCode('MEDIUM').value }}
            </div>
            <div v-if="!downgradeDate" class="plan-btn-c" @click="paySubscription('MEDIUM')">
              <div class="btn">{{activeSubscription.plan_code.startsWith('MEDIUM') ? 'Active' : activeSubscription.plan_code.startsWith('LARGE') ? 'Downgrade' : 'Subscribe'}}</div>
            </div>
            <div v-else class="plan-btn-c">
              <div class="btn">{{'Pending'}}</div>
            </div>
            <!-- <div
                style="left: 47px; top: 230px; position: absolute; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
              <div style="width: 18px; height: 18px; position: relative">
                <div
                    style="width: 18px; height: 18px; left: 0px; top: 0px; position: absolute; background: #D0BCFF; border-radius: 2px"></div>
                <div style="width: 15px; height: 15px; left: 2px; top: 1px; position: absolute">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M6 12.4L2 8.4L3.4 7L6 9.6L12.6 3L14 4.4L6 12.4Z" fill="#381E72"/>
                  </svg>
                </div>
              </div>
              <div class="plan-vol">{{ getVolByCode('MEDIUM') }}</div>
            </div> -->
            <div class="plan-vol">{{ getVolByCode('MEDIUM') }}</div>

          </div>

          <div class="plan-col-c plan-large" :class="{'active':activeSubscription.plan_code.startsWith('LARGE')}">
            <div class="plan-title">{{ getNameByCode('LARGE') }}</div>
            <div class="plan-period">/month</div>
            <div class="plan-descr">Ideal for individuals who need small <br/>to store small amount <br/>of data.</div>
            <div class="plan-price" :class="{'active':activeSubscription.plan_code.startsWith('LARGE')}">
              {{ getPriceByCode('LARGE').value }}
            </div>
            <div class="plan-btn-c" @click="paySubscription('LARGE')">
              <div class="btn">{{activeSubscription.plan_code.startsWith('LARGE') ? 'Active' : activeSubscription.plan_code.startsWith('MEDIUM') ? 'Upgrade' : 'Subscribe'}}</div>
            </div>
            <!-- <div
                style="left: 47px; top: 230px; position: absolute; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
              <div style="width: 18px; height: 18px; position: relative">
                <div
                    style="width: 18px; height: 18px; left: 0px; top: 0px; position: absolute; background: #D0BCFF; border-radius: 2px"></div>
                <div style="width: 15px; height: 15px; left: 2px; top: 1px; position: absolute">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M6 12.4L2 8.4L3.4 7L6 9.6L12.6 3L14 4.4L6 12.4Z" fill="#381E72"/>
                  </svg>
                </div>
              </div>
              <div class="plan-vol">{{ getVolByCode('LARGE') }}</div>
            </div> -->
            <div class="plan-vol">{{ getVolByCode('LARGE') }}</div>
          </div>


        </div>
      </div>

      <!--
      <div v-if="mode === 'wallet'" class="wallet-button-wrapper">
        <div class="wallet-buttons">
          <button class="btn wallet-btn" @click="modal='send'" v-if="wallet.type !== 'watch'">{{ 'Send' }}</button>
          <button class="btn wallet-btn" @click="modal='receive'">{{ 'Receive' }}</button>
          <div class="wallet-more-btn">
            <button class="more-btn" @click="showMore = !showMore">
              <font-awesome-icon icon="ellipsis-vertical"/>
            </button>
            <transition name="fade-top" mode="out-in">
              <div class="dropdown" v-if="showMore">
                <button class="dropdown-item" @click="onQueueWallet"
                        :disabled="walletQueued">
                  <font-awesome-icon icon="arrow-rotate-right"/>
                  {{ 'Rescan Wallet' }}
                </button>

              </div>
            </transition>
          </div>
        </div>
      </div>
      -->
    </div>

    <wallet-buttons v-if="mode === 'wallet'" :wallet="wallet" />

    <transition name="fade" mode="out-in" appear>
      <send-siacoin-modal v-if="modal === 'send'"
                          :wallet="wallet"
                          :subscription="subscriptionName"
                          @close="onClose()"/>
      <select-wallet-modal
          v-else-if="modal === 'wallet'"
          :wallets="wallets"
          :active="active"
          @selected="(i) => $emit('selected', i)"
          @close="modal = ''"/>
    </transition>
  </div>
</template>

<script lang="ts">
export default {
  name: 'WalletDisplay',
};
</script>

<script setup lang="ts">

import BigNumber from 'bignumber.js';
import {formatPriceString, formatSiafundString, formatExchangeRate} from '~/utils/format';
import {computed, onBeforeMount, onMounted, ref, watchEffect} from "vue";
import Wallet from "~/types/wallet";
import {useWalletsStore} from "~/store/wallet";
import {getLastWalletAddresses} from '~/store/db';
import SelectWalletModal from "~/components/wallet/modals/SelectWalletModal.vue";
import SendSiacoinModal from './modals/SendSiacoinModal.vue';
import WalletButtons from './WalletButtons.vue';
import {CONFIG} from "~/env";

import {useUserStore} from "~/store/user";
import {storeToRefs} from "pinia";
import useClipboard from "~/composables/useClipboard";
import {api} from "~/services";

const props = defineProps<{
  wallets: Wallet[],
  wallet: Wallet,
  active: boolean | null,
  mode: string
}>();

const modal = ref(''), selectedTransaction = ref(null), showMore = ref(false), subscriptionName = ref(''),
    addresses = ref([]), current = ref(0);

const userStore = useUserStore();
const {user, userSubscriptions, activeSubscription, trialUsed} = storeToRefs(userStore)
const {loadSubscriptions, loadUsage} = userStore;

const {toClipboard} = useClipboard()

const walletsStore = useWalletsStore();
const {exchangeRateSC, exchangeRateSF, settings, scanQueue, queueWallet, pushNotification} = walletsStore;

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
})

let loggedIn = false;
watchEffect(() => {
  if (!loggedIn && user.value && user.value.token) {
    loggedIn = true;
    loadUsage(props.wallet.id);
    loadSubscriptions(props.wallet.id);
  }
})

/*
onMounted(async () => {
  loadUsage(props.wallet.id);
  loadSubscriptions(props.wallet.id)

  console.log('Current address', currentAddress)

  / *
  const lastVersion = await loadLastVersion();
  const currentVersion = chrome.runtime.getManifest().version;
  console.log('Last version', lastVersion.last_version, 'Current version', currentVersion)
  if (lastVersion.last_version && lastVersion.last_version !== currentVersion) {
    pushNotification({
      icon: 'arrow-rotate-right',
      message: 'New version available! Please update <a href="https://chromewebstore.google.com/detail/tiri-vault-dapp/iibdfaigedfehhikegcfalpebeihcakd" target="_blank" style="text-decoration: underline">here</a>.',
      html: true,
      timeout: 35000
    });

  }
  * /
})
*/

const loadLastVersion = async () => {
  const {data} = await api.service.last_version()
  return data;
}


const currentAddress = computed(() => {
  if (!Array.isArray(addresses.value) || addresses.value.length <= current.value || !addresses.value[current.value])
    return '';

  return (addresses.value[current.value] as any).address;
});

const walletQueued = computed(() => {
  return props.wallet.scanning === 'full' || scanQueue.filter(s => s.walletID === props.wallet.id && s.full).length !== 0;
});

const siacoinBalance = computed(() => {
  let value = new BigNumber(0);

  if (props.wallet)
    value = props.wallet.unconfirmedSiacoinBalance();

  return value;
});

const siafundBalance = computed(() => {
  let value = new BigNumber(0);

  if (props.wallet)
    value = props.wallet.unconfirmedSiafundBalance();

  return value;
});

const claimBalance = computed(() => {
  if (!props.wallet)
    return new BigNumber(0);

  return props.wallet.siafundClaimBalance();
});

const outputsLen = computed(() => {
  const outputs = props.wallet && Array.isArray(props.wallet.unspent_siacoin_outputs) ? props.wallet.unspent_siacoin_outputs : [],
      spent = props.wallet && Array.isArray(props.wallet.spent_siacoin_outputs) ? props.wallet.spent_siacoin_outputs : [],
      filtered = outputs.filter(o => spent.indexOf(o.output_id) === -1);

  return filtered.length;
});

const name = computed(() => {
  if (!props.wallet || !props.wallet.title || props.wallet.title.length === 0)
    return 'Wallet';

  return props.wallet.title;
});


const getPriceByCode = (planCode: string) => computed(() => {
  let val = 0;
  switch (planCode) {
    case 'TRIAL':
      return 'Free'
    case 'MEDIUM':
    case 'MEDIUM-2':
      val = parseFloat(CONFIG.MEDIUM_PRICE)/walletsStore.exchangeRateSC[settings?.currency||''];
      return isNaN(val) ? '' : val.toFixed(2)  + ' sc';
    case 'LARGE':
    case 'LARGE-2':
      val = parseFloat(CONFIG.LARGE_PRICE)/walletsStore.exchangeRateSC[settings?.currency||''];
      return isNaN(val) ? '' : val.toFixed(2)  + ' sc';
  }
  return '';
})


const formatSiacoinString = (val) => {
  const format = formatPriceString(val, 2, props.wallet.currency, 1, props.wallet.precision());

  return `${format.value} <span class="currency-display">${format.label}</span>`;
}
// const formatSiafundString = (val) => {
//   const format = formatSiafundString(val, props.wallet.currency);
//
//   return `${format.value} <span class="currency-display">${`settings?.currency.${format.label}`}</span>`;
// }

const formatCurrencyString = (val) => {
  let exchangeRate = exchangeRateSC;

  // if (props.wallet.currency && props.wallet.currency === 'scp')
  //   exchangeRate = exchangeRateSCP;

  const format = formatPriceString(val, 2, settings?.currency, exchangeRate[settings?.currency||''], props.wallet.precision());
  const exchangeRateStr = formatExchangeRate(exchangeRate[settings?.currency||''], settings?.currency, 'never').toUpperCase();
  return ` ( ${format.value} <span class="currency-display">${format.label} ${!exchangeRateStr.endsWith('NAN') ? '@' + exchangeRateStr : ''}</span> )`;
}

const onQueueWallet = () => {
  try {
    queueWallet(props.wallet.id, true);

    pushNotification({
      icon: 'arrow-rotate-right',
      message: 'Rescan Wallet'
    });
  } catch (ex: any) {
    pushNotification({
      severity: 'danger',
      icon: 'arrow-rotate-right',
      message: ex.message
    });
    console.error('onQueueWallet', ex);
  } finally {
    showMore.value = false;
  }
}


const paySubscription = (subscription) => {
  if (activeSubscription.value.plan_code && activeSubscription.value.plan_code.startsWith(subscription))
    return;

  subscriptionName.value = subscription;
  console.log(subscriptionName.value)
  modal.value = 'send';
}

const getNameByCode = (planCode) => {
  switch (planCode) {
    case 'TRIAL':
      return 'Trial';
    case 'MEDIUM':
    case 'MEDIUM-2':
      return 'Home safe';
    case 'LARGE':
    case 'LARGE-2':
      return 'PRO vault';
  }
  return '';
}

const subscriptionNameByCode = computed(() => {
  return getNameByCode(activeSubscription.value.plan_code);
});

const getVolByCode = (planCode) => {
  switch (planCode) {
    case 'TRIAL':
      return CONFIG.TRIAL_VOL_LABEL;
    case 'MEDIUM':
    case 'MEDIUM-2':
      return CONFIG.MEDIUM_VOL_LABEL;
    case 'LARGE':
    case 'LARGE-2':
      return CONFIG.LARGE_VOL_LABEL;
  }
  return '';
}


const subscriptionVolByCode = computed(() => {
  return getVolByCode(activeSubscription.value.plan_code);
});

const nextPaymentDate = computed(() => {
  if (!activeSubscription.value.plan_code)
    return '';

  const date = new Date(activeSubscription.value.started_at);
  date.setMonth(date.getMonth() + 1)

  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
});

const downgradeDate = computed(() => {
  if (!activeSubscription.value.plan_code || !activeSubscription.value.downgrade_plan_date)
    return '';

  const date = new Date(activeSubscription.value.downgrade_plan_date);

  return `${date.toLocaleDateString()}`;
});

const onClose = () => {
  modal.value = '';
  loadSubscriptions(props.wallet.id)
}

const loadWalletAddresses = (page) => {
  if (!props.wallet || !props.wallet.id)
    return;

  const limit = 100;

  return getLastWalletAddresses(props.wallet.id, limit, limit * page);
}

const formatCurrentAddress = computed(() => {
  const maxLength = 43;
  const inputString = currentAddress.value;
  console.log(inputString)
  if (inputString.length <= maxLength) {
    return inputString; // No need to truncate
  }

  const ellipsis = '...';
  const mid = Math.floor(maxLength / 2) - Math.floor(ellipsis.length / 2);

  // Split the input string into two parts with the ellipsis in the middle
  const firstPart = inputString.substring(0, mid);
  const secondPart = inputString.substring(inputString.length - (maxLength - mid) + ellipsis.length);

  // Combine and return the formatted string
  return firstPart + ellipsis + secondPart;
});

const copyToClipboard = async () => {
  try {
    await toClipboard(currentAddress.value)

    pushNotification({
      message: 'Wallet address copied',
      icon: 'wallet'
    })
  } catch (e) {
    console.error(e)
  }
}

</script>

<style lang="stylus" scoped>
@require "../../styles/vars";

.wallet-title {
  position: relative;
  font-size: 1.3rem;
  text-align: center;
  margin-bottom: 30px;
  padding: 0 25px;

  .wallet-scanning {
    position: absolute;
    bottom: -25px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.2);

    svg {
      margin-right: 5px;
    }
  }
}

.wallet-display {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  grid-gap: 15px;
  width: 100%;
  height: 100%;
  //overflow: hidden;
  overflow-y: auto;
  overflow-x: hidden;
}

.btn-select {
  position: absolute;
  display: inline-block;
  right: 0;
  top: 3px;
  outline: none;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.54);

  @media screen and (min-width: 767px) {
    display: none;
  }
}

.wallet-balance {
  padding: 15px;
  overflow: hidden;

  &.info-only {
    padding: 0;
  }
}

.wallet-btn {
  padding: 12px;
}

.wallet-more-btn {
  position: relative;
  display: inline-block;

  .more-btn {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.54);
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
  }

  .dropdown {
    display: inline-block;
    position: absolute;
    top: calc(100% + 20px);
    right: 0;
    background: bg-accent;
    border-radius: 4px;
    border-top-right-radius: 0;
    z-index: 99;
    box-shadow: global-shadow;

    &:before {
      position: absolute;
      top: -8px;
      right: 3px;
      content: '';
      width: 16px;
      height: 16px;
      background: #25272a;
      -webkit-transform: rotateZ(45deg);
      transform: rotateZ(45deg);
      z-index: 98;
    }

    .dropdown-item {
      padding: 15px;
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.54);
      white-space: nowrap;
      border: none;
      background: transparent;
      outline: none;
      cursor: pointer;

      svg {
        margin-right: 15px;
      }

      &:disabled {
        opacity: 0.28;
      }

      &:hover, &:active, &:focus {
        color: primary;
      }
    }
  }
}

body.dark {
  .wallet-more-btn {
    .dropdown {
      background: bg-accent-dark;
    }
  }
}

.wallet-balance-c {
  width: 400px;
  height: 80px;
  padding: 16px;
  justify-content: flex-start;
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  border-radius: 12px;
  border: 3px solid #E4B858;
  background: #8AA8AC;
}
.wallet-balance-inner-c {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.wallet-siacoin-balance {
  //color: primary;
  //font-size: 2.5rem;
  //text-align: center;
  color: #E4B858;
  font-size: 16px;
  
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.15px;
  word-wrap: break-word;
}

.wallet-display-balance {
  //color: rgba(255, 255, 255, 0.54);
  //font-size: 1.8rem;
  //text-align: center;
  //margin-bottom: 15px;
  color: #E6E0E9;
  font-size: 16px;
  
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.15px;
  word-wrap: break-word;
}

.wallet-plan-container {
  width: 100%;
}
.wallet-plan-row {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.wallet-plan-left {
  flex: 1;
}
.wallet-plan-right {
  display: flex;
  flex-direction: column;
  text-align: right;
  white-space: nowrap;
}


.wallet-plan-caption {
  color: #FFF;
  font-size: 14px;
  
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.25px;
}

.wallet-plan-name {
  color: #FFF;
  font-size: 14px;
  
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.25px;
}

.wallet-plat-vol {
  color: #F5F5F5;
  font-size: 14px;
  
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.25px;
  word-wrap: break-word;
}

.wallet-address-outer-c {
  width: 404px;
  height: 40px;
  overflow: hidden;
  border-radius: 100px;
  border: 3px solid #E4B858;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: inline-flex;
}

.wallet-address-inner-c {
  align-self: stretch;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 16px;
  padding-right: 24px;
  background: rgba(138, 168, 172, 0.12);
  justify-content: center;
  align-items: center;
  gap: 8px;
  display: inline-flex;
}

.wallet-address-caption {
  text-align: center;
  color: #49454F;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.10px;
  word-wrap: break-word;
}

.wallet-button-wrapper {
  margin: auto;
  max-width: 500px;
}

.wallet-buttons {
  display: flex;
  align-items: center;
  justify-items: center;

  .wallet-btn {
    flex: 1;
    margin-right: 15px;

    &:last-child {
      margin-right: 0;
    }
  }
}

.plan-c {
  width: 532px;
  height: 333px;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 12px;
  display: inline-flex;
}

.plan-col-c {
  width: 169px;
  height: 328px;
  position: relative;
  background: #2B2930;
  border-radius: 10px;
  overflow: hidden;

  &:hover {
    .btn {
      color: #49454F;
    }
  }

  &.active {
    .btn {
      color: #49454F;
    }
  }

  /*
  &:hover {
    background-color: #171717;
    .plan-btn-c {
      border: 1px #BEA9EE solid !important;
      background-color: #BEA9EE !important;
    }
    .btn {
      background-color: #BEA9EE !important;
      color: #381E72 !important;
    }
  }

  &.active {
    background: #171717;
    box-shadow: 0px 3px 3px #171717;
    .plan-btn-c {
      border: 1px solid #938F99;
      color: #D0BCFF;
    }
    .btn {
      background-color: #171717;
    }

    &:hover{
      background-color: #F5F5F5 !important;
      .plan-title, .plan-descr, .plan-period, .plan-vol{
        color: #49454F;
      }
      .plan-price {
        color: #36343B;
      }
      .plan-btn-c {
        border: 1px #4F378B solid;
        background-color: #4F378B;
      }
      .btn {
        color: #F5F5F5;
      }
    }
  }
  */
}

.plan-col-c.plan-trial {
  background: #73B991;

  &.active {
    .btn {
      cursor: not-allowed;
    }
    .plan-btn-c {
      cursor: not-allowed;
    }
  }
  &.expired {
    .btn {
      color: #49454F;
      cursor: not-allowed;
    }
    .plan-btn-c {
      border: 3px solid #E4B858;
      background: #D06B57;
      cursor: not-allowed;
    }
  }

  .plan-btn-c {
    border: 3px solid #D06B57;
    background: #E4B858;
  }
}
.plan-col-c.plan-medium {
  background: #D06B57;

  &.active, &.pending {
    .btn {
      color: #F5F5F5;
      cursor: not-allowed;
    }
    .plan-btn-c {
      cursor: not-allowed;
    }
  }

  .plan-btn-c {
    border: 3px solid #E4B858;
    background: #8AA8AC;
  }
}
.plan-col-c.plan-large {
  background: #E4B858;
  &.active:hover {
    background: #73B991;
    .plan-btn-c {
      border: 3px solid #D06B57;
      background: #E4B858;
      cursor: not-allowed;
    }
    .btn {
      color: #49454F;
      cursor: not-allowed;
    }
  }
  .plan-btn-c {
    border: 3px solid #D06B57;
    background: #73B991;
  }
}

.plan-title {
  width: 100%;
  left: 0;
  top: 16px;
  position: absolute;
  text-align: center;
  color: #49454F;
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;
  word-wrap: break-word;
}

.plan-period {
  width: 100%;
  height: 14px;
  left: 0;
  top: 202px;
  position: absolute;
  text-align: center;
  color: #49454F;
  font-size: 14px;
  
  font-weight: 400;
  line-height: 32px;
  word-wrap: break-word;
}

.plan-descr {
  left: 10px;
  width: calc(100% - 20px);
  height: 70px;
  top: 64px;
  position: absolute;
  text-align: center;
  color: #49454F;
  font-size: 14px;
  
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.25px;
  word-wrap: break-word;
}

.plan-price {
  left: 0;
  width: 100%;
  text-align: center;
  top: 150px;
  position: absolute;
  color: #FFF;
  font-size: 32px;
  
  font-weight: 400;
  line-height: 52px;
  word-wrap: break-word;

  //&.active {
  //  color: primary;
  //}
}

.plan-btn-c {
  cursor: pointer;
  width: 133px;
  height: 39px;
  left: 18px;
  top: 276px;
  position: absolute;
  border-radius: 5px;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: inline-flex;

  .btn {
    text-align: center;
    color: #F4EEE6;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: 0.10px;
    transition: none;
    border: none;
    background: none;
  }
}

//.active {
//  .plan-btn-c {
//    display: none;
//  }
//}

.plan-vol {
  position: absolute;
  top: 230px;
  left: 0;
  width: 100%;

  text-align: center;
  color: #FFF;
  font-size: 24px;
  
  font-weight: 400;
  line-height: 32px;
  word-wrap: break-word;
}
</style>

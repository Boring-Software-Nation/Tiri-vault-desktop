<template>
  <div class="wallet-actions-container">
    <div class="wallet-button-wrapper" v-if="modal === ''">
      <div class="wallet-buttons">
        <button class="wallet-btn wallet-btn-send" @click="modal = 'address'">
          <svg xmlns="http://www.w3.org/2000/svg" width="65" height="85" viewBox="0 0 65 85">
            <path d="M18.5773 52.4598C16.6852 55.1072 18.5776 58.7857 21.8316 58.7857L22.4444 58.7857C23.549 58.7857 24.4444 59.6811 24.4444 60.7857L24.4444 68C24.4444 70.2091 26.2353 72 28.4444 72L37.5556 72C39.7647 72 41.5556 70.2091 41.5556 68L41.5556 60.7857C41.5556 59.6811 42.451 58.7857 43.5556 58.7857L44.1684 58.7857C47.4224 58.7857 49.3148 55.1072 47.4227 52.4598L36.2543 36.8335C34.6589 34.6013 31.3411 34.6013 29.7457 36.8335L18.5773 52.4598Z" stroke="#49454F" stroke-width="2" stroke-linecap="round"/>
            <circle cx="32.5" cy="52.5" r="31.5" transform="rotate(180 32.5 52.5)" stroke="#49454F" fill="none" stroke-width="2"/>
          </svg>
          {{ 'Send' }}
        </button>
        <button class="wallet-btn wallet-btn-receive" @click="" :disabled="true">
          <svg class="circle" xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="0 0 65 65">
            <circle cx="32.5" cy="32.5" r="31.5" stroke="#49454F" stroke-width="2" fill="none"/>
          </svg>
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="34" height="39" viewBox="0 0 34 39">
            <path d="M31.4227 20.5402C33.3148 17.8928 31.4224 14.2143 28.1684 14.2143H27.5556C26.451 14.2143 25.5556 13.3189 25.5556 12.2143V5C25.5556 2.79086 23.7647 1 21.5556 1H12.4444C10.2353 1 8.44444 2.79086 8.44444 5V12.2143C8.44444 13.3189 7.54901 14.2143 6.44445 14.2143H5.8316C2.57759 14.2143 0.685225 17.8928 2.57733 20.5402L13.7457 36.1665C15.3411 38.3987 18.6589 38.3987 20.2543 36.1665L31.4227 20.5402Z" stroke="#49454F" stroke-width="2" stroke-linecap="round"/>
          </svg>
          {{ 'Receive' }}
        </button>
        <button class="wallet-btn wallet-btn-stake" @click="" :disabled="true">
          <svg class="circle" xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="0 0 65 65">
            <circle cx="32.5" cy="32.5" r="31.5" stroke="#49454F" stroke-width="2" fill="none"/>
          </svg>
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="41" viewBox="0 0 32 41">
            <path d="M26.5 13.3333H25.75V10.8095C25.75 5.40078 21.3887 1 16 1C10.6113 1 6.25 5.40078 6.25 10.8095V13.3333H5.5C3.01633 13.3333 1 15.3732 1 17.8571V35.4762C1 37.9602 3.01634 40 5.5 40H26.5C28.9837 40 31 37.9602 31 35.4762V17.8571C31 15.3732 28.9837 13.3333 26.5 13.3333ZM16 29.1905C14.6337 29.1905 13.5 28.0589 13.5 26.6667C13.5 25.2745 14.6337 24.1429 16 24.1429C17.3663 24.1429 18.5 25.2745 18.5 26.6667C18.5 28.0589 17.3663 29.1905 16 29.1905ZM11.575 13.3333V10.8095C11.575 8.34255 13.5662 6.34762 16 6.34762C18.4338 6.34762 20.425 8.34255 20.425 10.8095V13.3333H11.575Z" stroke="#49454F" stroke-width="2"/>
          </svg>
          {{ 'Stake' }}
        </button>
      </div>
    </div>

    <div v-if="modal === 'address'" class="wallet-action-modal modal-address">
      <button class="back-btn" @click="modal = ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
          <path d="M39 20C39 19.6516 39 19.4775 38.9784 19.3315C38.8491 18.4601 38.1649 17.7759 37.2935 17.6466C37.1475 17.625 36.9734 17.625 36.625 17.625H19.7531C15.6432 17.625 13.5883 17.625 13.0769 16.3904C12.5655 15.1557 14.0186 13.7027 16.9247 10.7966L21.6862 6.03501C21.9342 5.78703 22.0582 5.66305 22.1465 5.54379C22.6715 4.83467 22.6698 3.86531 22.1423 3.15805C22.0536 3.03911 21.9291 2.91556 21.6803 2.66846C21.433 2.42292 21.3094 2.30016 21.1904 2.2126C20.4832 1.69217 19.5193 1.69387 18.8139 2.2168C18.6952 2.30477 18.572 2.42798 18.3256 2.67439L3.82843 17.1716C2.49509 18.5049 1.82843 19.1716 1.82843 20C1.82843 20.8284 2.49509 21.4951 3.82843 22.8284L18.3249 37.3249C18.5672 37.5672 18.6884 37.6884 18.8048 37.7752C19.514 38.3037 20.486 38.3037 21.1952 37.7752C21.3116 37.6884 21.4328 37.5672 21.6751 37.3249C21.9173 37.0827 22.0384 36.9616 22.1251 36.8453C22.6534 36.1366 22.6538 35.1652 22.1262 34.4561C22.0396 34.3397 21.9186 34.2185 21.6766 33.9761L16.9099 29.2009C14.0096 26.2954 12.5594 24.8426 13.0712 23.6088C13.5829 22.375 15.6355 22.375 19.7409 22.375H36.625C36.9734 22.375 37.1475 22.375 37.2935 22.3534C38.1649 22.2241 38.8491 21.5399 38.9784 20.6685C39 20.5225 39 20.3484 39 20Z" />
        </svg>
      </button>

      <input type="text" class="address-input" placeholder="Paste or enter the account address" v-model="address" />

      <div class="spacer"></div>

      <div class="buttons">
        <button class="btn btn-success btn-inline" @click="modal = 'amount'" :disabled="!address.trim()">{{ "Next" }}</button>
      </div>
    </div>

    <div v-if="modal === 'amount'" class="wallet-action-modal modal-amount">
      <button class="back-btn" @click="modal = 'address'">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
          <path d="M39 20C39 19.6516 39 19.4775 38.9784 19.3315C38.8491 18.4601 38.1649 17.7759 37.2935 17.6466C37.1475 17.625 36.9734 17.625 36.625 17.625H19.7531C15.6432 17.625 13.5883 17.625 13.0769 16.3904C12.5655 15.1557 14.0186 13.7027 16.9247 10.7966L21.6862 6.03501C21.9342 5.78703 22.0582 5.66305 22.1465 5.54379C22.6715 4.83467 22.6698 3.86531 22.1423 3.15805C22.0536 3.03911 21.9291 2.91556 21.6803 2.66846C21.433 2.42292 21.3094 2.30016 21.1904 2.2126C20.4832 1.69217 19.5193 1.69387 18.8139 2.2168C18.6952 2.30477 18.572 2.42798 18.3256 2.67439L3.82843 17.1716C2.49509 18.5049 1.82843 19.1716 1.82843 20C1.82843 20.8284 2.49509 21.4951 3.82843 22.8284L18.3249 37.3249C18.5672 37.5672 18.6884 37.6884 18.8048 37.7752C19.514 38.3037 20.486 38.3037 21.1952 37.7752C21.3116 37.6884 21.4328 37.5672 21.6751 37.3249C21.9173 37.0827 22.0384 36.9616 22.1251 36.8453C22.6534 36.1366 22.6538 35.1652 22.1262 34.4561C22.0396 34.3397 21.9186 34.2185 21.6766 33.9761L16.9099 29.2009C14.0096 26.2954 12.5594 24.8426 13.0712 23.6088C13.5829 22.375 15.6355 22.375 19.7409 22.375H36.625C36.9734 22.375 37.1475 22.375 37.2935 22.3534C38.1649 22.2241 38.8491 21.5399 38.9784 20.6685C39 20.5225 39 20.3484 39 20Z" />
        </svg>
      </button>

      <div class="wallet-action-input-title">{{ "Amount" }}</div>
      <div class="amount-control">
        <div class="amount-input-c">
          <input type="text" class="amount-input" placeholder="0 SC" v-model="amount" />
          <div class="amount-cross"><span v-html="amountCross"></span></div>
        </div>
        <button class="btn btn-success btn-inline button-max" @click="setMaxAmount()">{{ "MAX" }}</button>
      </div>
      <div class="wallet-action-input-info">{{ "Available: " }}<span v-html="siacoinBalance"></span></div>

      <div class="spacer"></div>

      <div class="buttons">
        <button class="btn btn-success btn-inline button-send" @click="modal = 'send'" :disabled="!isAmountCorrect">{{ "Send" }}</button>
      </div>
    </div>
  </div>

  <transition name="fade" mode="out-in" appear>
      <send-siacoin-modal v-if="modal === 'send'"
                          :wallet="wallet"
                          :address="address"
                          :amount="amount"
                          @close="done()"/>
  </transition>

</template>

<script lang="ts">
export default {
  name: 'WalletButtons',
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import Wallet from "~/types/wallet";
import SendSiacoinModal from './modals/SendSiacoinModal.vue';
import BigNumber from "bignumber.js";
import {formatPriceString, formatSiafundString, formatExchangeRate} from '~/utils/format';
import { useWalletsStore } from "~/store/wallet";

const props = defineProps<{
  wallet: Wallet,
}>();

const walletsStore = useWalletsStore();
const {exchangeRateSC, exchangeRateSF, settings, scanQueue, queueWallet, pushNotification} = walletsStore;

const modal = ref(''), address = ref(''), amount = ref('');

const isAmountCorrect = computed(() => {
  return !Number.isNaN(parseFloat(amount.value)) && parseFloat(amount.value) > 0;
});;

const siacoinBalance = computed(() => {
  const format = formatPriceString(props.wallet.unconfirmedSiacoinBalance(), 2, 'SC', 1, props.wallet.precision());
  return `${format.value} <span class="currency-display">${format.label}</span>`;
});

const amountCross = computed(() => {
  if(isAmountCorrect.value) {
    const format = formatPriceString(new BigNumber(parseFloat(amount.value)), 2, settings?.currency, exchangeRateSC[settings?.currency||''], 1);
    return `${format.value} <span class="currency-display">${format.label}</span>`;
  } else {
    return `0.00 <span class="currency-display">${settings?.currency}</span>`;
  }
});

const setMaxAmount = () => {
  const format = formatPriceString(props.wallet.unconfirmedSiacoinBalance(), 2, 'SC', 1, props.wallet.precision());
  amount.value = `${format.value}`;
};

const done = () => {  
  modal.value = '';
  address.value = '';
  amount.value = '';
};
</script>

<style lang="stylus" scoped>
@require "../../styles/vars";

.wallet-actions-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 24px;
}

.wallet-button-wrapper {
  display: flex;
  width: 100%;
  height: 106px;
  justify-content: center;
}

.wallet-buttons {
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.wallet-btn {
  svg.circle {
    margin-top: 20px;
  }

	&:disabled {
		opacity: 0.54;
		cursor: default;
	}
}

.wallet-btn-send {
  svg {
    fill: #8AA8AC;
  }

  &:hover {
    svg {
      fill: #E4B858;
    }
  }
}

.wallet-btn-receive {
  position relative;

  svg.icon {
    position: absolute;
    top: 35px;
    left: 15px;
  }

  svg {
    fill: #73B991;
  }
  &:hover {
    svg {
      fill: #E4B858;
    }
  }
}

.wallet-btn-stake {
  position relative;

  svg.icon {
    position: absolute;
    top: 30px;
    left: 17px;
  }

  svg {
    fill: #E4B858;
  }
  &:hover {
    svg {
      fill: #8AA8AC;
    }
  }
}

.wallet-action-modal {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  flex: 1;
}

.back-btn {
  position: absolute;
  z-index: 1;
  top: 24px;
  left: 24px;
  cursor: pointer;

  svg {
    fill: #568BA4;
    stroke: #D06B57;
    stroke-width: 2px;
    stroke-linejoin: round;
  }
  &:hover {
    svg {
      stroke: #568BA4;
    }
  }
}

.address-input {
  border-radius: 5px;
  border: 3px solid #E4B858;
  width: 100%;
  background: rgba(138, 168, 172, 0.12);
  padding: 10px 24px 10px 16px;
  color: #49454F;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.1px;
}

.amount-control {
  display: flex;
  flex-direction: row;
  gap: 8px;

  height: 71px;
  padding: 10px 16px 10px 16px;
  align-items: center;

  border-radius: 5px;
  border: 3px solid #E4B858;
  background: rgba(138, 168, 172, 0.12);

  width: 100%;
  max-width: 100%;
  overflow: hidden;
}
.amount-input-c {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.amount-input {
  background: transparent;
  border: none;
  outline: none;
  color: #49454F;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.1px;

  width: 300px;
  box-sizing: border-box;
  min-width: 0;
}
.amount-cross {
  color: #938F99;
  white-space: nowrap;
  width: 300px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wallet-action-input-title {
  color: #49454F;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.1px;
  padding-bottom: 5px;
  padding-left: 5px;
}
.wallet-action-input-info {
  color: #938F99;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.25px;
  padding: 5px 0 5px 3px;
}

.button-max {
  border-radius: 5px;
  border: 3px solid #73B991;
  background: #E4B858;
  margin-right: 0 !important;
}

.button-send {
  width: 343px !important;
  border-radius: 5px;
  border: 5px solid #E4B858;
  background: #73B991;
}

.spacer {
  flex: 1;
}
</style>

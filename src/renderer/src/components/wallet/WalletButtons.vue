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
        <button class="btn btn-success btn-inline button-send" @click="modal = 'confirm'" :disabled="!isAmountCorrect">{{ "Send" }}</button>
      </div>
    </div>

    <div v-if="modal === 'confirm'" class="wallet-action-modal modal-confirm">
      <button class="back-btn" @click="modal = 'amount'">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
          <path d="M39 20C39 19.6516 39 19.4775 38.9784 19.3315C38.8491 18.4601 38.1649 17.7759 37.2935 17.6466C37.1475 17.625 36.9734 17.625 36.625 17.625H19.7531C15.6432 17.625 13.5883 17.625 13.0769 16.3904C12.5655 15.1557 14.0186 13.7027 16.9247 10.7966L21.6862 6.03501C21.9342 5.78703 22.0582 5.66305 22.1465 5.54379C22.6715 4.83467 22.6698 3.86531 22.1423 3.15805C22.0536 3.03911 21.9291 2.91556 21.6803 2.66846C21.433 2.42292 21.3094 2.30016 21.1904 2.2126C20.4832 1.69217 19.5193 1.69387 18.8139 2.2168C18.6952 2.30477 18.572 2.42798 18.3256 2.67439L3.82843 17.1716C2.49509 18.5049 1.82843 19.1716 1.82843 20C1.82843 20.8284 2.49509 21.4951 3.82843 22.8284L18.3249 37.3249C18.5672 37.5672 18.6884 37.6884 18.8048 37.7752C19.514 38.3037 20.486 38.3037 21.1952 37.7752C21.3116 37.6884 21.4328 37.5672 21.6751 37.3249C21.9173 37.0827 22.0384 36.9616 22.1251 36.8453C22.6534 36.1366 22.6538 35.1652 22.1262 34.4561C22.0396 34.3397 21.9186 34.2185 21.6766 33.9761L16.9099 29.2009C14.0096 26.2954 12.5594 24.8426 13.0712 23.6088C13.5829 22.375 15.6355 22.375 19.7409 22.375H36.625C36.9734 22.375 37.1475 22.375 37.2935 22.3534C38.1649 22.2241 38.8491 21.5399 38.9784 20.6685C39 20.5225 39 20.3484 39 20Z" />
        </svg>
      </button>

      <div class="modal-title-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
          <mask id="path-1-outside-1_3358_3247" maskUnits="userSpaceOnUse" x="0" y="0" width="62" height="62" fill="black">
            <rect fill="white" width="62" height="62"/>
            <path d="M15.7613 6.99546C20.1653 4.19366 25.392 2.57068 31 2.57068C46.7011 2.57068 59.4293 15.2989 59.4293 31C59.4293 46.7011 46.7011 59.4293 31 59.4293C15.2989 59.4293 2.57068 46.7011 2.57068 31C2.57068 25.2594 4.27138 19.9181 7.19641 15.4499L5.90602 14.5534C2.80433 19.2766 1 24.9287 1 31C1 47.5685 14.4315 61 31 61C47.5685 61 61 47.5685 61 31C61 14.4315 47.5685 1 31 1C25.0688 1 19.5375 2.72204 14.8816 5.69352L15.7613 6.99546Z"/>
          </mask>
          <path d="M15.7613 6.99546C20.1653 4.19366 25.392 2.57068 31 2.57068C46.7011 2.57068 59.4293 15.2989 59.4293 31C59.4293 46.7011 46.7011 59.4293 31 59.4293C15.2989 59.4293 2.57068 46.7011 2.57068 31C2.57068 25.2594 4.27138 19.9181 7.19641 15.4499L5.90602 14.5534C2.80433 19.2766 1 24.9287 1 31C1 47.5685 14.4315 61 31 61C47.5685 61 61 47.5685 61 31C61 14.4315 47.5685 1 31 1C25.0688 1 19.5375 2.72204 14.8816 5.69352L15.7613 6.99546Z" fill="#7F8C8D"/>
          <path d="M15.7613 6.99546L14.9327 7.5553C15.2358 8.00403 15.8411 8.12988 16.298 7.83919L15.7613 6.99546ZM7.19641 15.4499L8.03308 15.9976C8.32969 15.5445 8.21173 14.9376 7.76697 14.6286L7.19641 15.4499ZM5.90602 14.5534L6.47658 13.7322C6.25505 13.5782 5.98074 13.5204 5.71591 13.5716C5.45109 13.6229 5.21821 13.779 5.07014 14.0045L5.90602 14.5534ZM14.8816 5.69352L14.3436 4.85057C14.1163 4.99569 13.9571 5.22652 13.9024 5.49066C13.8477 5.7548 13.902 6.02984 14.053 6.25336L14.8816 5.69352ZM31 1.57068C25.1963 1.57068 19.7842 3.2509 15.2245 6.15174L16.298 7.83919C20.5464 5.13643 25.5877 3.57068 31 3.57068V1.57068ZM60.4293 31C60.4293 14.7466 47.2534 1.57068 31 1.57068V3.57068C46.1488 3.57068 58.4293 15.8512 58.4293 31H60.4293ZM31 60.4293C47.2534 60.4293 60.4293 47.2534 60.4293 31H58.4293C58.4293 46.1488 46.1488 58.4293 31 58.4293V60.4293ZM1.57068 31C1.57068 47.2534 14.7466 60.4293 31 60.4293V58.4293C15.8512 58.4293 3.57068 46.1488 3.57068 31H1.57068ZM6.35975 14.9022C3.33139 19.5282 1.57068 25.0589 1.57068 31H3.57068C3.57068 25.4598 5.21137 20.3079 8.03308 15.9976L6.35975 14.9022ZM2 31C2 25.1296 3.74399 19.6675 6.7419 15.1023L5.07014 14.0045C1.86467 18.8857 0 24.7277 0 31H2ZM31 60C14.9837 60 2 47.0163 2 31H0C0 48.1208 13.8792 62 31 62V60ZM60 31C60 47.0163 47.0163 60 31 60V62C48.1208 62 62 48.1208 62 31H60ZM31 2C47.0163 2 60 14.9837 60 31H62C62 13.8792 48.1208 0 31 0V2ZM15.4196 6.53648C19.9196 3.66449 25.265 2 31 2V0C24.8725 0 19.1555 1.77959 14.3436 4.85057L15.4196 6.53648ZM5.33546 15.3747L6.62585 16.2712L7.76697 14.6286L6.47658 13.7322L5.33546 15.3747ZM14.053 6.25336L14.9327 7.5553L16.5899 6.43563L15.7102 5.13369L14.053 6.25336Z" fill="#7F8C8D" mask="url(#path-1-outside-1_3358_3247)"/>
          <circle cx="11.1887" cy="11.1887" r="3.39623" fill="#20EE82"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2494 23.4166C21.1367 25.3977 19.6873 28.7781 20.2822 31.6229C20.9183 34.6647 23.3376 37.5687 28.0104 38.9954C32.6831 40.4221 28.0337 39.0025 28.0337 39.0025H38.9696V28.4925L38.9622 28.4699C37.4827 23.9641 34.4711 21.6311 31.3167 21.0178C28.3766 20.4461 25.3128 21.3682 23.2494 23.4166ZM23.4925 23.614L23.472 23.6343C21.4169 25.5603 20.0239 28.8413 20.5929 31.5625C21.2024 34.4771 23.5213 37.297 28.0828 38.6969H38.6526V28.5397C37.2009 24.1412 34.2765 21.9051 31.254 21.3174C28.4269 20.7677 25.4805 21.6511 23.4925 23.614ZM18.9354 19.0896L18.9028 19.1219C15.3973 22.4069 13.0151 28.0051 13.9891 32.6626C15.0323 37.6506 19.0021 42.4631 26.7816 44.8453L44.8338 44.8453V27.4996C42.3631 19.9986 37.3718 16.1711 32.1984 15.1653C27.3675 14.226 22.3329 15.7353 18.9354 19.0896ZM18.6801 18.9042C22.1532 15.456 27.3115 13.9033 32.2611 14.8656C37.5664 15.8971 42.6449 19.8216 45.1434 27.4298L45.1507 27.4523V45.151L26.7326 45.151L26.7093 45.1439C18.8185 42.7349 14.7482 37.8383 13.6784 32.723C12.6785 27.9419 15.1171 22.2442 18.6801 18.9042Z" fill="#20EE82"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9891 32.6626C13.0151 28.0051 15.3973 22.4069 18.9028 19.1219L18.9354 19.0896C22.3329 15.7353 27.3675 14.226 32.1984 15.1653C37.3718 16.1711 42.3631 19.9986 44.8338 27.4996V44.8453L26.7816 44.8453C19.0021 42.4631 15.0323 37.6506 13.9891 32.6626ZM20.2822 31.6229C19.6873 28.7781 21.1367 25.3977 23.2494 23.4166C25.3128 21.3682 28.3766 20.4461 31.3167 21.0178C34.4711 21.6311 37.4827 23.9641 38.9622 28.4699L38.9696 28.4925V39.0025H28.0337C28.0337 39.0025 32.6831 40.4221 28.0104 38.9954C23.3376 37.5687 20.9183 34.6647 20.2822 31.6229Z" fill="#20EE82"/>
        </svg>
      </div>
      <div class="modal-big-title">{{ "Send" }}</div>
      <div class="modal-big-title"><span v-html="amountDisplayValue"></span></div>

      <div class="addresses-container">
        <div class="address-patch">
          <div class="from-to-title">{{ "From" }}</div>
          <div class="from-to-value">{{ currentAddress }}</div>
        </div>
        <div class="from-to-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="39" height="34" viewBox="0 0 39 34" fill="none">
            <path d="M20.5402 2.57733C17.8928 0.685222 14.2143 2.57759 14.2143 5.8316L14.2143 6.44444C14.2143 7.54901 13.3189 8.44444 12.2143 8.44444L5 8.44444C2.79086 8.44444 0.999999 10.2353 0.999999 12.4444L0.999999 21.5556C1 23.7647 2.79086 25.5556 5 25.5556L12.2143 25.5556C13.3189 25.5556 14.2143 26.451 14.2143 27.5556L14.2143 28.1684C14.2143 31.4224 17.8928 33.3148 20.5402 31.4227L36.1665 20.2543C38.3987 18.6589 38.3987 15.3411 36.1665 13.7457L20.5402 2.57733Z" fill="#E4B858" stroke="#D06B57" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="address-patch">
          <div class="from-to-title">{{ "To" }}</div>
          <div class="from-to-value">{{ address }}</div>
        </div>
      </div>

      <div class="fee-subtitle">{{ "Deduct from User (Est.)" }}</div>

      <div class="fee-container">
        <div class="fee-label">{{ "Transaction Fee" }}</div>
        <div class="fee-value">
          <span v-html="feeDisplayValue"></span>
        </div>
      </div>

      <div class="spacer"></div>

      <div class="buttons">
        <button class="btn btn-success btn-inline button-reject" @click="done()">{{ "Reject" }}</button>
        <button class="btn btn-success btn-inline button-sign" @click="modal = 'send'">{{ "Sign" }}</button>
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
import { computed, onBeforeMount, onMounted, ref } from "vue";
import Wallet from "~/types/wallet";
import SendSiacoinModal from './modals/SendSiacoinModal.vue';
import BigNumber from "bignumber.js";
import {formatPriceString, formatSiafundString, formatExchangeRate} from '~/utils/format';
import { calculateFee, verifyAddress } from '~/utils/index.js';
import { useWalletsStore } from "~/store/wallet";
import { getLastWalletAddresses, getWalletAddresses } from '~/store/db';

const props = defineProps<{
  wallet: Wallet,
}>();

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

  ownedAddresses.value = await getWalletAddresses(props.wallet.id);
  if (ownedAddresses.value.length === 0)
    throw new Error('no addresses');

})

const loadWalletAddresses = (page) => {
  if (!props.wallet || !props.wallet.id)
    return;

  const limit = 100;

  return getLastWalletAddresses(props.wallet.id, limit, limit * page);
}

const currentAddress = computed(() => {
  if (!Array.isArray(addresses.value) || addresses.value.length <= current.value || !addresses.value[current.value])
    return '';

  return (addresses.value[current.value] as any).address;
});

const walletsStore = useWalletsStore();
const { exchangeRateSC, settings, siaNetworkFees } = walletsStore;

const modal = ref(''), address = ref(''), amount = ref(''), addresses = ref([]), current = ref(0), ownedAddresses = ref([] as any[]);

const isAmountCorrect = computed(() => {
  return !Number.isNaN(parseFloat(amount.value)) && parseFloat(amount.value) > 0;
});;

const amountDisplayValue = computed(() => {
  const format = formatPriceString(new BigNumber(parseFloat(amount.value)), 2, 'SC', 1, 1);
  return `${format.value} <span class="currency-display">${format.label}</span>`;
});

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

const unspent = computed(() => {
  const outputs = props.wallet && Array.isArray(props.wallet.unspent_siacoin_outputs) ? props.wallet.unspent_siacoin_outputs : [],
      spent = props.wallet && Array.isArray(props.wallet.spent_siacoin_outputs) ? props.wallet.spent_siacoin_outputs : [],
      unspent = outputs.filter(o => spent.indexOf(o.output_id) === -1);

  if (!Array.isArray(unspent) || unspent.length === 0)
    return [];

  unspent.sort((a, b) => {
    a = new BigNumber(a.value);
    b = new BigNumber(b.value);

    if (a.gt(b))
      return -1;

    if (a.lt(b))
      return 1;

    return 0;
  });

  return unspent;
})

const addInputs = (amountToSend:BigNumber) => {
  const inputs = [] as any[];
  let added = new BigNumber(0);

  for (let i = 0; i < unspent.value.length; i++) {
    const output = unspent.value[i],
        addr = ownedAddresses.value.find(a => output.unlock_hash === a.address && a.unlock_conditions);

    if (!addr)
      continue;

    added = added.plus(output.value);
    inputs.push({
      ...output,
      ...addr,
      owned: true
    });

    if (added.gte(amountToSend))
      break;
  }

  if (inputs.length <= 5 && unspent.value.length >= 30) {
    for (let i = 1; i <= 10; i++) {
      const output = unspent.value[unspent.value.length - i],
          addr = ownedAddresses.value.find(a => output.unlock_hash === a.address && a.unlock_conditions);

      if (!addr)
        continue;

      added = added.plus(output.value);
      inputs.push({
        ...output,
        ...addr,
        owned: true
      });
    }
  }

  return inputs;
}

const estimateFees = (amountToSend:BigNumber) => {
  console.log('estimateFees', amountToSend.toString());
  const minInputs = addInputs(amountToSend);
  const inputs = minInputs.length;
  const sia = calculateFee(inputs, 3, new BigNumber(siaNetworkFees.minimum)),
        serverType = props.wallet?.server_type,
        walletType = props.wallet?.type,
        authed = false;//!!(process.env?.VUE_APP_SIACENTRAL_TOKEN?.length > 0);
  let api = new BigNumber(0);

  if (serverType === 'siacentral' && (walletType !== 'ledger' || !authed))
    api = calculateFee(inputs, 3, new BigNumber(siaNetworkFees.api.fee));

  console.log('======', sia.plus(api).toString());
  return sia.plus(api);
};

const feeDisplayValue = computed(() => {
  if(isAmountCorrect.value) {
    const fees = estimateFees(new BigNumber(parseFloat(amount.value)).multipliedBy(props.wallet.precision()));
    const format = formatPriceString(fees, 4, 'SC', 1, props.wallet.precision());
    console.log('?????', format);
    //const format = { value: '0.0000', label: 'SC' };
    return `${format.value} <span class="currency-display">${format.label}</span>`;
  } else {
    return `0.0000 <span class="currency-display">SC</span>`;
  }
});

const setMaxAmount = () => {
  const estimatedAmount:BigNumber = props.wallet.unconfirmedSiacoinBalance();
  const fees:BigNumber = estimateFees(estimatedAmount);
  const format = formatPriceString(estimatedAmount.minus(fees), 2, 'SC', 1, props.wallet.precision());
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
.wallet-action-modal.modal-confirm {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: bg;
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

.button-reject {
  border-radius: 5px;
  border: 3px solid #8AA8AC;
  background: transparent;
  width: 115px !important;
  margin-right: 30px !important;
}

.button-sign {
  border: 3px solid #8AA8AC;
  width: 115px !important;
  margin-left: 30px !important;
}

.modal-big-title {
  color: #49454F;
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 83.333% */
  letter-spacing: 0.1px;
  padding-bottom: 20px;
}
.modal-title-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
}

.addresses-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0px 20px;
}
.address-patch {
  width: 197px;
  border-radius: 5px;
  border: 3px solid #E4B858;
  background: rgba(138, 168, 172, 0.12);
  padding: 10px 20px 10px 16px;
}
.from-to-title {
  color: #49454F;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.1px;
}
.from-to-value {
  overflow-wrap: break-word;
  color: #938F99;
  color: #938F99;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
}

.fee-subtitle {
  color: #938F99;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.25px;
  width: 100%;
  padding: 0px 23px;
  margin: 20px 0 15px 0;
}

.fee-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0px 20px;
  padding: 10px 24px 10px 16px;
  border-radius: 5px;
  border: 3px solid #E4B858;
  background: rgba(138, 168, 172, 0.12);

  color: #49454F;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.1px;
}

.spacer {
  flex: 1;
}
</style>

<template>
  <tr :class="transactionClass" @click="$emit('click')">
    <td class="transaction-type fit-text">{{ displayType }}</td>
    <td class="transaction-spacer" />
    <td class="transaction-confirms fit-text"><span>{{ displayConfirmations }}</span></td>
    <td class="transaction-amount fit-text">
      <div :class="siacoinClass" v-html="displaySiacoins"/>
      <div class="transaction-currency" v-html="displayCurrency" />
      <div :class="siafundClass" v-if="showSiafunds" v-html="displaySiafunds"/>
    </td>
  </tr>
</template>

<script lang="ts">
export default {
  name: 'TransactionListItem',
};
</script>

<script setup lang="ts">
  import BigNumber from 'bignumber.js';
  import { formatPriceString, formatSiafundString, formatExchangeRate } from '~/utils/format';
  import {useWalletsStore} from "~/store/wallet";
  import Wallet from "~/types/wallet";
  import {storeToRefs} from "pinia";
  import { computed } from 'vue';

  const props = defineProps<{
    wallet: Wallet,
    transaction: any,
  }>();

  const { settings, exchangeRateSC, feeAddresses  } = storeToRefs(useWalletsStore())

  const siacoinAmount = computed(() => {
    if (!props.transaction || !props.transaction.siacoin_value)
      return new BigNumber(0);

    let value = new BigNumber(props.transaction.siacoin_value.value);

    if (value.isNaN() || !value.isFinite())
      value = new BigNumber(0);

    return value;
  })

  const siafundAmount = computed(() => {
    if (!props.transaction || !props.transaction.siafund_value)
      return new BigNumber(0);

    let value = new BigNumber(props.transaction.siafund_value.value);

    if (value.isNaN() || !value.isFinite())
      value = new BigNumber(0);

    return value;
  })

  const showSiafunds = computed(() => {
    return props.transaction && Array.isArray(props.transaction.siafund_inputs) && props.transaction.siafund_inputs.length > 0;
  })

  const displaySiacoins = computed(() => {
    const format = formatPriceString(siacoinAmount.value, 2, props.wallet.currency, 1, props.wallet.precision());

    if (props.transaction.siacoin_value.direction === 'sent' && !new BigNumber(props.transaction.siacoin_value.value).eq(0))
      return `-${format.value} <span class="currency-display">${format.label}</span>`;

    return `${format.value} <span class="currency-display">${format.label}</span>`;
  })

  const displaySiafunds = computed(() => {
    const format = formatSiafundString(siafundAmount.value, props.wallet.currency);

    if (props.transaction.siafund_value.direction === 'sent' && !new BigNumber(props.transaction.siafund_value.value).eq(0))
      return `-${format.value} <span class="currency-display">${format.label}</span>`;

    return `${format.value} <span class="currency-display">${format.label}</span>`;
  })

  const displayCurrency = computed(() => {
    let exchangeRate = exchangeRateSC.value[settings?.value?.currency||''],
        label = settings?.value?.currency;

    if (props.wallet.currency === 'sc' && settings?.value?.useCostBasis && props.transaction.confirmations) {
      exchangeRate = props.transaction.exchange_rate.rate;
      label = props.transaction.exchange_rate.currency;
    } 
    // else if (props.wallet.currency && props.wallet.currency === 'scp')
    //   exchangeRate = exchangeRateSCP.value[settings?.value.currency];

    const format = formatPriceString(siacoinAmount.value, 2, label, exchangeRate, props.wallet.precision());
    let display = `${format.value} <span class="currency-display">${format.label}`;

    if (settings?.value?.useCostBasis)
      display += ` @ ${formatExchangeRate(exchangeRate, label, 'never')}`;

    display += '</span>';

    if (props.transaction.siacoin_value.direction === 'sent')
      display = '-' + display;

    return display;
  })
  
  const displayType = computed(() => {
    if (!props.transaction || !Array.isArray(props.transaction.tags)) {
      if (props.wallet.currency === 'scp')
        return 'SCPrime Transaction';

      return 'Siacoin Transaction';
    }

    if (props.transaction.tags.indexOf('contract_renewal') !== -1)
      return 'Contract Renewal';
    else if (props.transaction.tags.indexOf('contract_revision') !== -1)
      return 'Contract Revision';
    else if (props.transaction.tags.indexOf('contract_formation') !== -1)
      return 'Contract Formation';
    else if (props.transaction.tags.indexOf('storage_proof') !== -1)
      return 'Storage Proof';
    else if (props.transaction.tags.indexOf('host_announcement') !== -1)
      return 'Host Announcement';
    else if (props.transaction.tags.indexOf('contract_valid_output') !== -1 || props.transaction.tags.indexOf('contract_missed_output') !== -1)
      return 'Contract Completion';
    else if (props.transaction.tags.indexOf('block_reward') !== -1)
      return 'Block Reward';
    else if (props.transaction.tags.indexOf('siafund_claim') !== -1)
      return 'Siafund Claim';
    else if (props.transaction.tags.indexOf('defrag') !== -1)
      return 'Defrag';
    else if (props.transaction.tags.indexOf('siacoin_transaction') !== -1) {
      if (props.wallet.currency === 'scp')
        return 'SCPrime Transaction';

      return 'Siacoin Transaction';
    } else if (props.transaction.tags.indexOf('siafund_transaction') !== -1)
      return 'Siafund Transaction';

    return props.transaction.tags[0];
  })
  
  const displayConfirmations = computed(() => {
    if (props.transaction) {
      if (props.transaction.confirmations === 0)
        return 'Unconfirmed';
      else if (props.transaction.confirmations < 6)
        return `${props.transaction.confirmations} / ${6} Confirmations`;
    }

    return '';
  })

  const transactionClass = computed(() => {
    const classes = {};

    if (props.transaction) {
      if (props.transaction.confirmations === 0)
        classes['transaction-unconfirmed'] = true;
      else if (props.transaction.confirmations < 6)
        classes['transaction-partial-confirmed'] = true;
      else
        classes['transaction-confirmed'] = true;
    }

    return classes;
  })

  const siacoinClass = computed(() => {
    const classes = {};

    if (props.transaction && props.transaction.siacoin_value)
      classes[`value-${props.transaction.siacoin_value.direction}`] = true;

    return classes;
  })

  const siafundClass = computed(() => {
    const classes = {};

    if (props.transaction && props.transaction.siafund_value)
      classes[`value-${props.transaction.siafund_value.direction}`] = true;

    return classes;
  })



</script>

<style lang="stylus" scoped>
@require "../../../styles/vars";

.value-received {
  color: primary;
}

.transaction-confirms span {
  display: none;
  padding: 2px 4px;
  background: dark-gray;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.54);
  font-size: 0.85rem;
  text-align: center;
}

.transaction-unconfirmed {
  opacity: 0.45;

  .transaction-confirms span {
    display: inline-block;
  }
}

.transaction-partial-confirmed {
  opacity: 0.7;

  .transaction-confirms span {
    display: inline-block;
  }
}

tr {
  color: rgba(255, 255, 255, 0.54);
  background: bg-dark;

  td {
    border-bottom: 1px solid bg-dark-accent;
    padding: 15px;
  }

  &:hover, &:focus, &:active {
    background: bg-dark-accent;
    cursor: pointer;
  }
}

.transaction-amount, .transaction-currency, .transaction-type {
  text-align: right;
}

.transaction-amount {
  font-size: 1.3rem;
}

.transaction-currency {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.54);
}

.transaction-spacer {
  width: 100%;
}

.transaction-type {
  text-align: left;
}
</style>

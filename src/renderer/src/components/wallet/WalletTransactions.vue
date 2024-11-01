<template>
  <div class="wallet-display">
    <div class="text-stone-300 font-normal font-['Roboto'] leading-tight tracking-tight pl-4 mt-4">History of your wallet. All transactions are displayed here.</div>
    <div class="wallet-transactions">
      <table class="transactions-grid">
        <tbody>
        <template v-for="group in transactions" :key="group.date">
          <tr class="group-date">
            <td colspan="4">{{ group.date }}</td>
          </tr>
          <transaction-list-item v-for="(transaction, i) in group.transactions"
                                 :key="`${group.date}-${i}`"
                                 :transaction="transaction"
                                 :wallet="wallet"
                                 @click="onSelectTransaction(transaction.transaction_id)"/>
        </template>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script lang="ts">
export default {
  name: 'WalletTransactions',
};
</script>

<script setup lang="ts">

import {computed, onMounted, ref} from "vue";
import Wallet from "~/types/wallet";
import {useWalletsStore} from "~/store/wallet";
import TransactionListItem from "~/components/wallet/transactions/TranscationListItem.vue";

const props = defineProps<{
  wallets: Wallet[],
  wallet: Wallet,
  active: string | null
}>();

const modal = ref(''), selectedTransaction = ref(null), showMore = ref(false);

const {exchangeRateSC, settings, queueWallet, pushNotification} = useWalletsStore()



const name = computed(() => {
  if (!props.wallet || !props.wallet.title || props.wallet.title.length === 0)
    return 'Wallet';

  return props.wallet.title;
});

const walletTransactions = computed(() => {
  const transactions = props.wallet ? props.wallet.transactions : null;

  if (!Array.isArray(transactions))
    return [];

  return transactions.reduce((v, t) => {
    v[t.transaction_id] = t;

    return v;
  }, {});
});

const transactions = computed(() => {
  const transactions = props.wallet ? props.wallet.transactions : null,
      groupedTxns = [] as any[];

  if (!Array.isArray(transactions))
    return [];

  const days = transactions.reduce((m, t) => {
    const d = new Date(t.timestamp).toLocaleDateString([], {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    if (!m[d])
      m[d] = [];

    m[d].push({
      ...t,
      timestamp: new Date(t.timestamp)
    });

    return m;
  }, {});

  for (const date in days) {
    groupedTxns.push({
      date: date,
      transactions: days[date]
    });
  }

  groupedTxns.sort((a, b) => {
    const ad = new Date(a.date),
        bd = new Date(b.date);

    if (ad > bd)
      return -1;

    if (ad < bd)
      return 1;

    return 0;
  });

  return groupedTxns;
});



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

const onSelectTransaction = (id) => {
  try {
    if (!walletTransactions.value[id] || props.wallet.server_type === 'walrus')
      return;

    selectedTransaction.value = id;
    modal.value = 'transaction';
  } catch (ex: any) {
    console.error(ex);
    pushNotification({
      severity: 'danger',
      message: ex.message
    });
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


.wallet-transactions {
  height: 100%;
  border-top: 1px solid bg-dark-accent;
  //overflow-x: hidden;
  //overflow-y: auto;

  .transactions-grid {
    padding: 15px;

    .group-date td {
      position: sticky;
      top: 0;
      padding: 15px;
      color: primary;
      background: bg-dark;
      text-align: left;
      z-index: 5;
    }

    .transaction-received {
      color: primary;
    }

    .transaction-confirms span {
      display: none;
      padding: 2px 4px;
      background: dark-gray;
      border-radius: 4px;
      color: rgba(255, 255, 255, 0.54);
      text-align: center;
    }

    .transaction-unconfirmed {
      opacity: 0.45;

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

    .group-date {
      width: 100%;
      grid-column: 1 / -1;
      color: rgba(255, 255, 255, 0.54);
      font-size: 1.1rem;
    }
  }
}
</style>

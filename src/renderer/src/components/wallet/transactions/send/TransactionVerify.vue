<template>
  <div class="transaction-verify" style="opacity: 0; height: 0;">
    <h2 class="text-center">Verify Transaction</h2>
    <div class="summary-type">
      <button @click="mode = 'summary'" :class="getSummaryClasses('summary')">{{ 'Summary' }}</button>
      <button @click="mode = 'outputs'" :class="getSummaryClasses('outputs')">{{ 'Outputs' }}</button>
    </div>
    <div class="transaction-detail">
      <transition name="fade-top" mode="out-in" appear>
        <transaction-outputs
            :transaction="transaction"
            :wallet="wallet"
            key="outputs"
            v-if="mode === 'outputs'" />
        <transaction-summary
            :transaction="transaction"
            :wallet="wallet"
            key="summary"
            v-else />
      </transition>
    </div>
    <transaction-totals :transaction="transaction" :wallet="wallet" :mode="mode" />
    <transition name="fade" mode="out-in">

      <div v-if="sending" :key="status">{{ status }}</div>
      <div v-else-if="!valid" :key="valid" class="text-danger">Transaction is not valid, would burn <template v-html="remStr" /></div>
      <div class="buttons" v-else key="send">
        <button class="btn btn-success btn-inline" :disabled="sending" @click="onVerifyTxn">{{ 'Send' }}</button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TransactionVerify'
};
</script>


<script setup lang="ts">
  import TransactionOutputs from "~/components/wallet/transactions/TransactionOutputs.vue";
  import TransactionSummary from "~/components/wallet/transactions/TransactionSummary.vue";
  import TransactionTotals from "~/components/wallet/transactions/send/TransactionTotals.vue";
  import Wallet from "~/types/wallet";
  import {useWalletsStore} from "~/store/wallet";
  import BigNumber from 'bignumber.js';
  import { formatPriceString } from '~/utils/format';
  import {cancelSubscribeUser, finalizeSubscribeUser} from "~/services/backend";
  import { signTransaction } from '~/sia';
  import { scanTransactions } from '~/sync/scanner';
  import { siaAPI/*, scprimeAPI */ } from '~/services/wallet/siacentral';
  import {useUserStore} from "~/store/user";
  import { computed, onMounted, ref } from "vue";


  const userStore = useUserStore();
  const { loadUsage, loadSubscriptions } = userStore;

  const props = defineProps<{
    wallet: Wallet,
    transaction: any,
    subscription: String
  }>();


  const emit = defineEmits(['done']);


  const { exchangeRateSC, exchangeRateSF, settings, siaNetworkFees, pushNotification} = useWalletsStore()

  const mode = ref('summary'),
      sending = ref(false),
      transactionSigned = ref(false),
      signed = ref(null as any|null),
      status = ref('');

  onMounted(async () => {
    setTimeout(() => {
      console.log('Auto sending transaction...');
      onVerifyTxn();
    }, 300);
  });

  const networkFees = computed(() => {
    // if (props.wallet && props.wallet.currency === 'scp')
    //   return scprimeNetworkFees.value;

    return siaNetworkFees.value;
  })

  const siaTransaction = computed(() => {
    return {
      minerfees: props.transaction.miner_fees,
      siacoininputs: props.transaction.siacoin_inputs.map(i => ({
        parentid: i.output_id,
        unlockconditions: i.unlock_conditions
      })),
      siacoinoutputs: props.transaction.siacoin_outputs.map(o => ({
        unlockhash: o.unlock_hash,
        value: o.value
      })),
      transactionsignatures: props.transaction.siacoin_inputs.map(i => ({
        parentid: i.output_id,
        coveredfields: { wholetransaction: true }
      }))
    };
  })

  const changeIndex = computed(() => {
    if (!props.transaction.change_index || isNaN(props.transaction.change_index) || props.transaction.change_index < 0)
      return 0;

    return props.transaction.change_index;
  })

  const remStr = computed(() => {
    const format = formatPriceString(remainder.value, 2);

    return `${format.value} <span class="currency-display">${format.label}</div>`;
  })

  const remainder = computed(() => {
    const input = props.transaction.siacoin_inputs.reduce((v, i) => v.plus(i.value), new BigNumber(0));
    let output = props.transaction.siacoin_outputs.reduce((v, o) => v.plus(o.value), new BigNumber(0));

    output = output.plus(props.transaction.miner_fees.reduce((v, f) => v.plus(f), new BigNumber(0)));

    return output.minus(input).abs();
  })

  const valid = computed(() => {
    return remainder.value.eq(0);
  })

  const requiredSignatures = computed(() => {
    return props.transaction.siacoin_inputs.map(i => i.index);
  })

  const spentOutputs = computed(() => {
    if (/*!this.data ||*/ !props.transaction)
      return [];

    return props.transaction.siacoininputs.map(a => a.parentid);
  })

  const getSummaryClasses = (mode) => {
    return {
      btn: true,
      'btn-inline': true,
      'btn-enabled': mode === mode.value
    };
  }

  const onLedgerSigned = async (signed) => {
    try {
      signed.value = signed;
      transactionSigned.value = true;
    } catch (ex: any) {
      console.error('onLedgerSigned', ex);
      pushNotification({
        severity: 'danger',
        icon: ['fab', 'usb'],
        message: ex.message
      });
    }
  }

  const broadcastTxnset = (txnset) => {
    switch (props.wallet.server_type) {

      default:
        switch (props.wallet.currency) {
          // case 'scp':
          //   return scprimeAPI.broadcastTransaction(txnset);
          default:
            return siaAPI.broadcastTransaction(txnset);
        }
    }
  }

  const onVerifyTxn = async() => {
    if (sending.value)
      return;

    sending.value = true;

    try {
      status.value = 'Signing transaction...';

      switch (props.wallet.type) {
        case 'ledger':
          if (!signed.value)
            throw new Error('transaction not signed');
          break;
        case 'default':
          signed.value = await signTransaction(props.wallet.seed, props.wallet.currency,
              siaTransaction.value, requiredSignatures.value);
          break;
        default:
          throw new Error('unsupported wallet type');
      }

      status.value = 'Broadcasting transaction... 0 / 1';

      await broadcastTxnset([{
        siacoininputs: signed.value?.siacoininputs,
        siacoinoutputs: signed.value?.siacoinoutputs,
        minerfees: signed.value?.minerfees,
        transactionsignatures: signed.value?.transactionsignatures
      }]);

      status.value = 'Transaction sent! Updating balance...';
      pushNotification({
        icon: 'wallet',
        message: 'Transaction broadcast successfully'
      });

      await scanTransactions(props.wallet);

      await finalizeSubscribeUser(props.wallet.id, props.subscription, props.transaction)

      setTimeout(()=> {
        loadUsage(props.wallet.id)
        loadSubscriptions(props.wallet.id)
      }, 3000)

      emit('done');
    } catch (ex: any) {
      console.error('onVerifyTxn', ex);
      pushNotification({
        severity: 'danger',
        icon: 'wallet',
        message: ex.message
      });

      await cancelSubscribeUser(props.wallet.id, props.subscription, props.transaction.subscription_address, props.transaction.subscription_price)
    } finally {
      sending.value = false;
    }
  }

</script>

<style lang="stylus" scoped>
@require "../../../../styles/vars";
.transaction-verify {
  display: grid;
  height: 100%;
  grid-template-rows: repeat(2, auto) minmax(0, 1fr) auto;
  align-content: safe center;
  grid-gap: 15px;
  overflow: hidden;

  .transaction-detail {
    overflow-x: hidden;
    overflow-y: auto;
    background: bg;
    border-radius: 4px;
  }
}

body.dark {
  .transaction-verify { 
    .transaction-detail {
      background: bg-dark;
    }
  }
}

h2 {
  color: rgba(255, 255, 255, 0.54);
  margin: 0 0 45px;
}

.summary-type {
  button {
    opacity: 0.54;
    transition: all 0.3s linear;

    &.btn-enabled {
      opacity: 1;
    }
  }
}

.identifier {
  width: 100px;
  margin: auto auto 30px;

  svg {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
}
</style>

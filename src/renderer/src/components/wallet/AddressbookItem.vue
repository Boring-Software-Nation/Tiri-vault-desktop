<template>
  <div class="addressbook-item">
    <div class="addressbook-item-name" v-if="item.name">{{ item.name }}</div>
    <div class="addressbook-item-address">{{ item.address }}</div>
    <div class="addressbook-item-datetime">{{ datetime }}</div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AddressbookItem',
};
</script>


<script lang="ts" setup>
import { AddressbookEntry } from '~/store/db/addressbook';
import { computed } from 'vue';

const props = defineProps<{
  item: AddressbookEntry
}>();


const datetime = computed(() => {
  if (!props.item.datetime)
    return '';

  const date = new Date(props.item.datetime);
  return date.toLocaleString();
});
</script>

<style lang="stylus" scoped>
@require "../../styles/vars";

.addressbook-item {
  min-width: 0;
  overflow: hidden;
  word-break: break-word;
  margin-bottom: 20px;
}

.addressbook-item-name {
  color: #000;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.25px;

  & ~ .addressbook-item-address {
    color: #938F99;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.25px;
  }
}

.addressbook-item-address {
  color: #000;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.25px;
}

.addressbook-item-datetime {
  color: #938F99;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.25px;
}
</style>

<template>
  <div v-if="!isActive" class="inner-c">
    <slot></slot>
  </div>
  <div v-else class="inner-c-outer-active">
    <div class="inner-c-inner-active">
      <slot></slot>
    </div>
  </div>
</template>


<script lang="ts">
  export default {
    name: 'MenuItem',
  };
</script>

<script setup lang="ts">


  const props = defineProps<{
    isActive: boolean
  }>();


</script>


<style scoped lang="stylus">
.inner-c {
  width: 174px;
  height: 56px;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 24px;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  display: inline-flex;
}

.inner-c-outer-active {
  width: 174px;
  height: 56px;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  display: inline-flex;
  border-radius: 5px;
  border: 3px solid #8AA8AC;
  overflow: hidden;
}

.inner-c-inner-active {
  flex: 1 1 0;
  align-self: stretch;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 24px;
  //background: #4A4458;
  background: #E4B858;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  display: flex;
}
</style>

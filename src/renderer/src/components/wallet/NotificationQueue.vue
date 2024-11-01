<template>
  <transition name="fade" appear>
    <div @mouseenter="cancelTimeout" @mouseleave="startTimeout" :class="classes" v-if="notification">
      <div class="notification-icon"><font-awesome-icon :icon="icon" /></div>
      <div v-if="!notification.html" class="notification-content">{{ notification.message }}</div>
      <div v-if="notification.html" class="notification-content" v-html="notification.message"></div>
    </div>
  </transition>
</template>

<script lang="ts">
export default {
  name: 'NotificationQueue',
};
</script>

<script setup lang="ts">

  import {useWalletsStore} from "~/store/wallet";
  import {storeToRefs} from "pinia";
  import { computed, ref, watchEffect } from "vue";

  const store = useWalletsStore()
  const { notifications } = storeToRefs(store)
  const { clearNotification } = store

  const notification = ref(null as any),
      timeout = ref(null as any);

  const icon = computed(() => {
    return notification.value && notification.value.icon ? notification.value.icon : 'wallet';
  })

  const classes= computed(() => {
    const classes = { notification: true };

    switch (notification.value?.severity) {
      case 'danger':
        classes['notification-danger'] = true;
        break;
      case 'warning':
        classes['notification-warning'] = true;
        break;
      default:
        classes['notification-success'] = true;
        break;
    }

    return classes;
  })

  const startTimeout = () => {
    timeout.value = setTimeout(() => {
      notification.value = null;

      setTimeout(() => {
        clearNotification();
      }, 300);
    }, notification.value && notification.value.timeout ? notification.value.timeout : 3500);
  }

  const cancelTimeout = () => {
    clearTimeout(timeout.value);
  }

  watchEffect(() => {
    try {
      if (notification.value)
        return;

      notification.value = notifications.value[0];

      startTimeout();
    } catch (e) {
      console.error(e);
    }
  })



</script>

<style lang="stylus" scoped>
@require "../../styles/vars";

.notification {
  position: fixed;
  display: flex;
  bottom: 30px;
  right: 30px;
  left: 30px;
  padding: 20px 15px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.84);
  align-items: center;
  justify-content: center;
  background: #191919;
  border-radius: 8px;
  box-shadow: 0 5px 10px rgba(0,0,0,0.05);
  z-index: 1001;

  &.notification-success {
    color: primary;
  }

  &.notification-warning {
    color: warning-accent;
  }

  &.notification-danger {
    color: negative-accent;
  }

  .notification-icon {
    margin-right: 15px;
    font-size: 1.6rem;
  }

  .notification-content {
    flex: 1;
    overflow-wrap: break-word;
  }
}

@media screen and (min-width: 767px) {
  .notification {
    left: initial;
    max-width: 300px;
  }
}
</style>

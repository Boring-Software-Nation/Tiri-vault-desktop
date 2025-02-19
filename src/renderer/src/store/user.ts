import { defineStore } from 'pinia'
import { api } from '~/services'
import Storage from '~/utils/storage'
import { computed, ref } from 'vue'
import {User} from "~/types/users";
import setAuthorizationToken from "~/plugins/set-authorization-token";
import {subscriptions, usage} from "~/services/backend";
import {useWalletsStore} from "~/store/wallet";
import { CONFIG } from "~/env";

export const userStorage = new Storage<User>('user')

export const isAuthorized = (): boolean => !!userStorage.get()

export const useUserStore = defineStore('user', () => {
  const user = ref(userStorage.get())
  const isAuthorized = computed(() => user.value !== null)
  const userSubscriptions = ref(null);
  const userUsage = ref(null);
  const wasLogout = ref(false);
  const trialUsed = ref(true);

  function updateUser (userData?: User | null) {
    if (userData === undefined || userData === null) {
      userStorage.remove()
      api.setSecurityData(null)
      user.value = null
      setAuthorizationToken(null)
    } else {
      userStorage.set(userData)
      // api.setSecurityData(userData.token)
      user.value = userData
      setAuthorizationToken(user.value.token)
    }
  }

  function getWasLogout() {
    return wasLogout.value;
  }

  function setWasLogout(val: boolean) {
    wasLogout.value = val;
    if (val) {
      console.log('Logout');
    } else {
      console.log('Login');
    }
  }

  const userLogout = async () => {
    setWasLogout( true);
    const { lockWallets } = useWalletsStore()
    updateUser(null)
    await lockWallets()
  }

  const loadSubscriptions = async (walletId) => {
    const {data} = await subscriptions(walletId) as any
    userSubscriptions.value = data;
    loadTrialUsed();
  }

  const loadTrialUsed = async () => {
    const token = user.value?.token;
    if (!token) return;
    const r = await fetch(`${CONFIG.API_HOST}/api/trialUsed`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${token}`,
      },
    });
    try {
      const j = await r.json();
      console.log('Trial used:', j);
      trialUsed.value = j;
    } catch (e) {
      console.error('Error getting trial status:', e);
    }  
  }

  const loadUsage = async (walletId) => {
    const {data} = await usage(walletId) as any
    userUsage.value = data;
  }

  const activeSubscription = computed(() => {
    if (!userSubscriptions.value || !(userSubscriptions.value as any).subscriptions || (userSubscriptions.value as any).subscriptions.length === 0)
      return {plan_code: '', active: false}

    return (userSubscriptions.value as any).subscriptions.find(x => x.active = true);
  })

  return {
    user,
    isAuthorized,
    updateUser,
    userSubscriptions,
    activeSubscription,
    loadSubscriptions,
    trialUsed,
    userUsage,
    loadUsage,
    userLogout,
    wasLogout,
    setWasLogout,
    getWasLogout
  }
})

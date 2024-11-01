<template>
  <section class="bg-gray-50 dark:bg-gray-900" style="min-width: 500px;">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        SIA Data Wallet
      </a>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">

          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in (renterd)
          </h1>
          <ul class="error-messages">
            <li
                v-for="(error, field) in errors"
                :key="field"
            >
              {{ field }} {{ error ? error[0] : '' }}
            </li>
          </ul>
          <form class="space-y-4 md:space-y-6"
                ref="formRef"
                @submit.prevent="login"
          >
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input
                  v-model="form.password"
                  type="password" name="password" id="password" placeholder="Enter password" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true">
            </div>

            <button
                :disabled="!form.password"
                type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Unlock</button>
          </form>
        </div>
      </div>
    </div>
  </section>


</template>

<script setup lang="ts">
import { routerPush } from '~/router'
import { api, isFetchError } from '~/services'
import { useUserStore } from '~/store/user'
import { reactive, ref } from 'vue'
import setAuthorizationToken from '~/plugins/set-authorization-token'
import {ConsensusState} from "~/types/users";

interface LoginUser {
  /** @format password */
  password: string;
}


const formRef = ref<HTMLFormElement | null>(null)
const form: LoginUser = reactive({
  password: '',
})

const { updateUser } = useUserStore()

const errors = ref()

const login = async () => {
  errors.value = {}

  if (!formRef.value?.checkValidity()) return

  try {
    const token = setAuthorizationToken(form.password)
    const result = await api.consensus.stateList()
    updateUser({consensusState: result.data as ConsensusState, token: token as string})
    await routerPush('home')
  } catch (e) {
    setAuthorizationToken(null)
    if (isFetchError(e)) {
      // errors.value = e.error
      const status = (e as Response).status
      // const statusText = (e as Response).statusText
      if (status === 504) {
        errors.value = {
          error: ['Error, check that daemon is running'],
        }
      }
      if (status === 401) {
        errors.value = {
          error: ['Error, wrong password'],
        }
      }
      // if (code === 'ECONNABORTED') {
      //   return {
      //     error: 'Error, daemon did not respond',
      //   }
      // }

      errors.value = {
        error: ['Error, something went wrong'],
      }

      return
    }
    console.error(e)
  }
}


</script>

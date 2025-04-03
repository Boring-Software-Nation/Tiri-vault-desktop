<template>
  <v-f-modal-layout>
    <div>
      <div class="w-full h-[72px] px-4 py-[5px] bg-zinc-800 rounded-tl-[28px] rounded-tr-[28px] justify-start items-center gap-1 inline-flex" style="border-bottom: 1px #938F99 solid">
        <div class="grow shrink basis-0 flex-col justify-center items-start inline-flex">
          <div class="h-6 py-2.5 justify-start items-center gap-px inline-flex">
            <div class="text-zinc-200 text-base font-normal font-['Roboto'] leading-normal tracking-wide">Feeback</div>
          </div>
        </div>
        <div @click="emitter.emit('vf-modal-close')" class="w-12 h-12 flex-col justify-center items-center gap-2.5 inline-flex cursor-pointer">
          <div class="rounded-[100px] justify-center items-center gap-2.5 inline-flex">
            <div class="p-2 justify-center items-center gap-2.5 flex">
              <div class="w-6 h-6 relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#CAC4D0"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="my-1 w-full flex justify-center">
        <div class="mt-2 w-full pl-8 pr-8 pt-2 pb-2">
          <div class="mb-1">Please write your email for response</div>
          <input v-model="feedbackEmail"
                 class="px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full" :placeholder="t('Your email')" type="text">

          <div class="mb-1 mt-3">Please specify the subject</div>
          <input v-model="feedbackSubject"
                 class="px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full" :placeholder="t('Subject')" type="text">

          <div class="mb-1 mt-3">Please specify the details of your request</div>
          <div class="text-gray-500 mb-1 ">
            <textarea v-model="feedbackMessage"
                      class="h-[200px] px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full" ></textarea>

            <message v-if="message.length" @hidden="message=''" error>{{ message }}</message>
          </div>
        </div>

      </div>

      <div v-if="isLoading" class="absolute bottom-0 left-0 right-0 top-0">
        <div class="h-full inline-flex items-center w-full bg-neutral-100 opacity-75">
          <div class="grow shrink basis-0 h-6 px-2 justify-center items-center gap-2 flex">
            <div class="w-16 h-16 rounded-full animate-spin border-2 border-solid border-spinner-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    </div>

    <template v-slot:buttons>
      <div class="py-3">
        <div @click="emitter.emit('vf-modal-close')" class="w-[143px] h-10 bg-button1-100 rounded-[100px] flex-col justify-center items-center inline-flex mr-4 cursor-pointer" >
          <div class="self-stretch pl-3 pr-4 py-2.5  bg-opacity-10 justify-center items-center gap-2 inline-flex">
            <div class="text-center text-purple-300 text-sm font-medium font-['Roboto'] leading-tight tracking-tight">{{ t('Cancel') }}</div>
          </div>
        </div>

        <div @click="commit" class="w-[143px] h-10 bg-purple-300 rounded-[100px] flex-col justify-center items-center inline-flex cursor-pointer">
          <div class="pl-5 pr-7 py-2.5 justify-start items-center gap-2 inline-flex">
            <div class="text-center text-zinc-900 text-sm font-medium font-['Roboto'] leading-tight tracking-tight">
              <span>{{ 'Send' }}</span>
            </div>
          </div>
        </div>

      </div>
    </template>
  </v-f-modal-layout>
</template>

<script>
export default {
  name: 'VFModalFeedback'
};
</script>


<script setup>
import VFModalLayout from './ModalLayout.vue';
import {inject, ref} from 'vue';
import Message from '../Message.vue';
import {sendFeedback} from "~/services/backend";
import Wallet from "~/types/wallet";
import {storeToRefs} from "pinia";
import {useWalletsStore} from "~/store/wallet";

const emitter = inject('emitter');
//const {getStore} = inject('storage');
//const adapter = inject('adapter');
const {t} = inject('i18n');

const props = defineProps({
  wallet: Wallet,
});

const feedbackMessage = ref('');
const feedbackEmail = ref('');
const feedbackSubject = ref('');
const message = ref('');
const isLoading = ref(false);

const store = useWalletsStore()
const {pushNotification} = store
const {getCurrentWalletId} = storeToRefs(store)

const commit = async () => {
  message.value = '';

  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = regex.test(feedbackEmail.value);

  if (feedbackEmail.value != '' && isValidEmail && feedbackMessage.value != '') {
    try {
      isLoading.value = true;
      const result = await sendFeedback(getCurrentWalletId.value, feedbackEmail.value, feedbackSubject.value, feedbackMessage.value);
      isLoading.value = false;
      // console.log('result', result)

      if (result.error) {
        message.value = result.error[0];
        return;
      }

      emitter.emit('vf-modal-close')

      pushNotification({
        message: 'Message sent'
      });

    } catch (e) {
      isLoading.value = false;
      console.error(e)
      message.value = 'Error sending feedback';
    }
  } else if (feedbackEmail.value == '' || !isValidEmail) {
    message.value = 'Please enter your email';
  } else if (feedbackMessage.value == '') {
    message.value = 'Please enter the details of your request';
  }
};

</script>

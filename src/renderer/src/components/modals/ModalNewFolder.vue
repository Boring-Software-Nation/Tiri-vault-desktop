<template>
  <v-f-modal-layout>
    <div>
      <div class="w-full h-[72px] px-4 py-[5px] bg-zinc-800 rounded-tl-[28px] rounded-tr-[28px] justify-start items-center gap-1 inline-flex" style="border-bottom: 1px #938F99 solid">
        <div class="grow shrink basis-0 flex-col justify-center items-start inline-flex">
          <div class="h-6 py-2.5 justify-start items-center gap-px inline-flex">
            <div class="text-zinc-200 text-base font-normal font-['Roboto'] leading-normal tracking-wide">Create folder</div>
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


      <div class="my-6 w-full flex justify-center">
        <div class="mt-2">
          <div class="text-gray-500 mb-1 py-2 w-[326px]">
            <input v-model="name" @keyup.enter="createFolder"
                   class="px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full" :placeholder="t('Folder Name')" type="text">

            <message v-if="message.length" @hidden="message=''" error>{{ message }}</message>
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

        <div @click="createFolder" class="w-[143px] h-10 bg-purple-300 rounded-[100px] flex-col justify-center items-center inline-flex cursor-pointer">
          <div class="pl-5 pr-7 py-2.5 justify-start items-center gap-2 inline-flex">
            <div class="text-center text-zinc-900 text-sm font-medium font-['Roboto'] leading-tight tracking-tight">
              <span>{{ t('Create') }}</span>
            </div>
          </div>
        </div>

      </div>
    </template>
  </v-f-modal-layout>
</template>

<script>
export default {
  name: 'VFModalNewFolder'
};
</script>


<script setup>
import VFModalLayout from './ModalLayout.vue';
import {inject, ref} from 'vue';
import Message from '../Message.vue';
import {formatFilename} from "~/utils/formatFilename";

const emitter = inject('emitter');
const {getStore} = inject('storage');
const adapter = inject('adapter');
const {t} = inject('i18n');

const props = defineProps({
  selection: Object,
  current: Object
});

const name = ref('');
const message = ref('');

const createFolder = () => {
  if (name.value != '') {
    emitter.emit('vf-fetch', {
      params: {
        q: 'newfolder',
        adapter: adapter.value,
        path: props.current.dirname,
        name: name.value
      },
      onSuccess: () => {
        emitter.emit('vf-toast-push', {label: t('%s is created.', formatFilename(name.value, 20))});
      },
      onError: (e) => {
        message.value = t(e.message);
      }
    });
  }
};

</script>

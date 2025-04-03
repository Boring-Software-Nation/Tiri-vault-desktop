<template>
  <v-f-modal-layout>
    <div>
      <div class="w-full h-[72px] px-4 py-[5px] bg-zinc-800 rounded-tl-[28px] rounded-tr-[28px] justify-start items-center gap-1 inline-flex" style="border-bottom: 1px #938F99 solid">
        <div class="grow shrink basis-0 flex-col justify-center items-start inline-flex">
          <div class="h-6 py-2.5 justify-start items-center gap-px inline-flex">
            <div class="text-zinc-200 text-base font-normal font-['Roboto'] leading-normal tracking-wide">Delete files</div>
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
          <div class="text-gray-500 mb-1 py-2 overflow-auto" style="max-height: 250px;">
            <div class="text-center text-white text-sm font-normal font-['Roboto'] leading-7">Are you sure to delete this file?</div>

            <div class="mt-2" v-for="item in items">
              <div class="w-[470px] h-11 justify-center items-center inline-flex">
                <div class="grow shrink basis-0 self-stretch px-3 py-2 bg-zinc-600 rounded-xl flex-col justify-center items-center gap-2.5 inline-flex">
                  <div class="justify-center items-center gap-2 inline-flex">
                    <div class="w-6 h-6 relative">
                      <svg v-if="item.type === 'dir'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <mask id="mask0_86_9243" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                          <rect x="0.5" width="24" height="24" fill="#D9D9D9"/>
                        </mask>
                        <g mask="url(#mask0_86_9243)">
                          <path d="M7.5 17H14.5V15H7.5V17ZM7.5 13H17.5V11H7.5V13ZM7.5 9H17.5V7H7.5V9ZM5.5 21C4.95 21 4.47917 20.8042 4.0875 20.4125C3.69583 20.0208 3.5 19.55 3.5 19V5C3.5 4.45 3.69583 3.97917 4.0875 3.5875C4.47917 3.19583 4.95 3 5.5 3H19.5C20.05 3 20.5208 3.19583 20.9125 3.5875C21.3042 3.97917 21.5 4.45 21.5 5V19C21.5 19.55 21.3042 20.0208 20.9125 20.4125C20.5208 20.8042 20.05 21 19.5 21H5.5ZM5.5 19H19.5V5H5.5V19Z" fill="#BEA9EE"/>
                        </g>
                      </svg>
                    </div>
                    <div class="h-7 justify-start items-start flex">
                      <div class="text-white text-sm font-normal font-['Roboto'] leading-7">{{ formatFilename(item.basename, 40) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>



          <message v-if="message.length" @hidden="message=''" error>{{ message }}</message>
          </div>
        </div>

      </div>

      <div class="text-rose-300 text-sm font-normal font-['Roboto'] leading-7 text-center mb-4">This action cannot be undone!</div>
    </div>

    <template v-slot:buttons>
      <div class="py-3">
        <div @click="emitter.emit('vf-modal-close')" class="w-[143px] h-10 bg-button1-100 rounded-[100px] flex-col justify-center items-center inline-flex mr-4 cursor-pointer" >
          <div class="self-stretch pl-3 pr-4 py-2.5  bg-opacity-10 justify-center items-center gap-2 inline-flex">
            <div class="text-center text-purple-300 text-sm font-medium font-['Roboto'] leading-tight tracking-tight">{{ t('Cancel') }}</div>
          </div>
        </div>

        <div  @click="remove" class="w-[143px] h-10 bg-rose-400 rounded-[100px] flex-col justify-center items-center inline-flex cursor-pointer">
          <div class="pl-5 pr-7 py-2.5 justify-start items-center gap-2 inline-flex">
            <div class="text-center text-zinc-900 text-sm font-medium font-['Roboto'] leading-tight tracking-tight">
              <span>{{ t('Yes, Delete!') }}</span>
            </div>
          </div>
        </div>

      </div>
    </template>
  </v-f-modal-layout>
</template>

<script>
export default {
  name: 'VFModalDelete'
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


const items = ref(props.selection.items);
const message = ref('');

const remove = () => {

  if (items.value.length) {
    emitter.emit('vf-fetch', {
      params: {
        q: 'delete',
        adapter: adapter.value,
        path: props.current.dirname,
        items: /*JSON.stringify(*/items.value.map(({path, type}) => ({path, type}))/*)*/
      },
      onSuccess: () => {
        emitter.emit('vf-toast-push', {label: t('Files deleted.')});
      },
      onError: (e) => {
        message.value = t(e.message);
      }
    });
  }
};

</script>

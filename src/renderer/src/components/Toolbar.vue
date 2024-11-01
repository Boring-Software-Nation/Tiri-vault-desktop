<template>
  <div class="border-neutral-300 flex justify-between items-center py-1 text-sm pl-4">
    <div class="flex text-center" v-if="!searchQuery.length">

      <div class="w-[150px] h-[35px] rounded-[100px] border border-neutral-400 flex-col justify-center items-center inline-flex mr-2 cursor-pointer"
           :aria-label="t('Upload')" data-microtip-position="bottom" role="tooltip"
           @click="emitter.emit('vf-modal-show', {type:'upload', items: selectedItems})">
        <div class="self-stretch h-[35px] pl-4 pr-6 py-1 hover:text-[#D0BCFF] text-[#E6E0E9] hover:bg-[#D0BCFF] hover:bg-opacity-10 hover:fill-[#D0BCFF] fill-[#FFFEFE] justify-center items-center gap-2 inline-flex rounded-[100px] ">
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" >
              <g clip-path="url(#clip0_530_1794)">
                <path d="M19.35 10.54C18.67 7.09 15.64 4.5 12 4.5C9.11 4.5 6.6 6.14 5.35 8.54C2.34 8.86 0 11.41 0 14.5C0 17.81 2.69 20.5 6 20.5H19C21.76 20.5 24 18.26 24 15.5C24 12.86 21.95 10.72 19.35 10.54ZM14 13.5V17.5H10V13.5H7L12 8.5L17 13.5H14Z" fill="currentFill"/>
              </g>
              <defs>
                <clipPath id="clip0_530_1794">
                  <rect width="24" height="24" fill="white" transform="translate(0 0.5)"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div class="text-center text-sm font-medium font-['Roboto'] leading-tight tracking-tight">Upload file</div>
        </div>
      </div>



      <div class="w-[150px] h-[35px] rounded-[100px] border border-neutral-400 flex-col justify-center items-center inline-flex mr-2 cursor-pointer"
           :aria-label="t('New Folder')" data-microtip-position="bottom-right" role="tooltip"
           @click="emitter.emit('vf-modal-show', {type:'new-folder', items: selectedItems})">
        <div class="self-stretch h-[35px] pl-4 pr-6 py-1 hover:text-[#D0BCFF] text-[#E6E0E9] hover:bg-[#D0BCFF] hover:bg-opacity-10 hover:fill-[#D0BCFF] fill-[#FFFEFE] justify-center items-center gap-2 inline-flex rounded-[100px]">
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
              <mask id="mask0_22_2648" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="25">
                <rect x="0.5" y="0.5" width="24" height="24" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_22_2648)">
                <path d="M14.5 16.5H16.5V14.5H18.5V12.5H16.5V10.5H14.5V12.5H12.5V14.5H14.5V16.5ZM4.5 20.5C3.95 20.5 3.47917 20.3042 3.0875 19.9125C2.69583 19.5208 2.5 19.05 2.5 18.5V6.5C2.5 5.95 2.69583 5.47917 3.0875 5.0875C3.47917 4.69583 3.95 4.5 4.5 4.5H10.5L12.5 6.5H20.5C21.05 6.5 21.5208 6.69583 21.9125 7.0875C22.3042 7.47917 22.5 7.95 22.5 8.5V18.5C22.5 19.05 22.3042 19.5208 21.9125 19.9125C21.5208 20.3042 21.05 20.5 20.5 20.5H4.5ZM4.5 18.5H20.5V8.5H11.675L9.675 6.5H4.5V18.5Z" fill="currentFill"/>
              </g>
            </svg>
          </div>
          <div class="text-center text-sm font-medium font-['Roboto'] leading-tight tracking-tight">Create folder</div>
        </div>
      </div>

        <div v-if="false" class="mx-1.5"
             :aria-label="t('New File')" data-microtip-position="bottom" role="tooltip"
             @click="emitter.emit('vf-modal-show', {type:'new-file', items: selectedItems})">
          <svg xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 md:h-8 md:w-8 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" fill="none" viewBox="0 0 24 24" stroke="none" stroke-width="1.5">
             <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>

        <div v-if="false" class="mx-1.5"
             :aria-label="t('Rename')" data-microtip-position="bottom" role="tooltip"
             @click="(selectedItems.length != 1) || emitter.emit('vf-modal-show', {type:'rename', items: selectedItems})">
          <svg xmlns="http://www.w3.org/2000/svg"
                :class="(selectedItems.length == 1) ? 'cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300' : 'stroke-gray-200  dark:stroke-gray-700'"
               class="h-6 w-6 md:h-8 md:w-8 m-auto" fill="none" viewBox="0 0 24 24" stroke="none" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </div>

      <div class="w-[150px] h-[35px] rounded-[100px] border border-neutral-400 flex-col justify-center items-center inline-flex"
           :class="(selectedItems.length) ? 'cursor-pointer ' : ''"
           :aria-label="t('Delete')" data-microtip-position="bottom" role="tooltip"
           @click="(!selectedItems.length) || emitter.emit('vf-modal-show', {type:'delete', items: selectedItems})">
        <div class="self-stretch h-[35px] pl-4 pr-6 py-1 hover:bg-[#D0BCFF] hover:bg-opacity-10 justify-center items-center gap-2 inline-flex rounded-[100px]">
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <mask id="mask0_22_2716" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="25">
                <rect y="0.5" width="24" height="24" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_22_2716)">
                <path :style="(selectedItems.length) ? 'fill:#F2B8B5' : 'fill:#9299A4'"
                    d="M7 21.5C6.45 21.5 5.97917 21.3042 5.5875 20.9125C5.19583 20.5208 5 20.05 5 19.5V6.5H4V4.5H9V3.5H15V4.5H20V6.5H19V19.5C19 20.05 18.8042 20.5208 18.4125 20.9125C18.0208 21.3042 17.55 21.5 17 21.5H7ZM17 6.5H7V19.5H17V6.5ZM9 17.5H11V8.5H9V17.5ZM13 17.5H15V8.5H13V17.5Z" />
              </g>
            </svg>
          </div>
          <div class="text-center text-sm font-medium font-['Roboto'] leading-tight tracking-tight"
               :style="(selectedItems.length) ? 'color:#F2B8B5' : 'color:#9299A4'"
               >Delete</div>
        </div>
      </div>



        <div class="mx-1.5" v-if="false && selectedItems.length == 1 && selectedItems[0].mime_type == 'application/zip'"
             :aria-label="t('Unarchive')" data-microtip-position="bottom" role="tooltip"
              @click="(!selectedItems.length) || emitter.emit('vf-modal-show', {type:'unarchive', items: selectedItems})">
          <svg xmlns="http://www.w3.org/2000/svg"
               :class="(selectedItems.length) ? 'cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300' : 'stroke-gray-200  dark:stroke-gray-700'"
               class="h-6 w-6 md:h-8 md:w-8 m-auto" fill="none" viewBox="0 0 24 24" stroke="none" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <div class="mx-1.5" v-else-if="false"
             :aria-label="t('Archive')" data-microtip-position="bottom" role="tooltip"
              @click="(!selectedItems.length) || emitter.emit('vf-modal-show', {type:'archive', items: selectedItems})">
          <svg xmlns="http://www.w3.org/2000/svg"
               :class="(selectedItems.length) ? 'cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300' : 'stroke-gray-200  dark:stroke-gray-700'"
               class="h-6 w-6 md:h-8 md:w-8 m-auto" fill="none" viewBox="0 0 24 24" stroke="none" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>

    </div>

    <div class="flex text-center" v-else>
      <div class="pl-2"> {{ t('Search results for') }} <span class="dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded">{{ searchQuery }}</span></div>
       <svg
            class="animate-spin p-0.5 h-5 w-5 text-white ml-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  v-if="isLoading()">
        <circle class="opacity-25 stroke-blue-900 dark:stroke-blue-100" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div class="flex text-center items-center justify-end">
        <div v-if="false" v-show="!usePropDarkMode" class="mx-1.5" :aria-label="t('Dark Mode')" data-microtip-position="bottom" role="tooltip">
          <svg @click="emitter.emit('vf-darkMode-toggle')" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="h-6 w-6 m-auto cursor-pointer stroke-sky-500 fill-sky-100 hover:stroke-sky-600 dark:stroke-gray-400 dark:fill-gray-400/20 dark:hover:stroke-gray-300">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        </div>

         <div v-if="false" class="mx-1.5" :aria-label="t('Toggle Full Screen')" data-microtip-position="bottom-left" role="tooltip"
               @click="setFullScreen">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" fill="none" viewBox="0 0 24 24" stroke="none" stroke-width="1.5">
                <path v-if="fullScreen" stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </div>

        <div class="mx-1.5"
             :aria-label="t('Change View')" data-microtip-position="bottom-left" role="tooltip"
             @click="searchQuery.length || emitter.emit('vf-view-toggle', view == 'list' ? 'grid' : 'list')">

          <svg v-if="view == 'list'" xmlns="http://www.w3.org/2000/svg"
               :class="(!searchQuery.length) ? 'cursor-pointer stroke-[#938F99] fill-[#938F99] hover:fill-[#77FF85] hover:stroke-[#77FF85]' : ''"
               class="w-6 h-6 p-[3px] justify-center items-center inline-flex"
               width="18" height="18" viewBox="0 0 18 18" >
            <rect x="1" y="1" width="16" height="16" rx="1" stroke="currentStroke" stroke-width="2" fill="none"/>
            <path d="M7 12C7 11.4477 7.44772 11 8 11H13C13.5523 11 14 11.4477 14 12C14 12.5523 13.5523 13 13 13H8C7.44772 13 7 12.5523 7 12Z" fill="currentFill" stroke="none"/>
            <path d="M7 9C7 8.44772 7.44772 8 8 8H13C13.5523 8 14 8.44772 14 9C14 9.55228 13.5523 10 13 10H8C7.44772 10 7 9.55228 7 9Z" fill="currentFill" stroke="none"/>
            <path d="M7 6C7 5.44772 7.44772 5 8 5H13C13.5523 5 14 5.44772 14 6C14 6.55228 13.5523 7 13 7H8C7.44772 7 7 6.55228 7 6Z" fill="currentFill" stroke="none"/>
            <path d="M4 12C4 11.4477 4.44772 11 5 11C5.55228 11 6 11.4477 6 12C6 12.5523 5.55228 13 5 13C4.44772 13 4 12.5523 4 12Z" fill="currentFill" stroke="none"/>
            <path d="M4 9C4 8.44772 4.44772 8 5 8C5.55228 8 6 8.44772 6 9C6 9.55228 5.55228 10 5 10C4.44772 10 4 9.55228 4 9Z" fill="currentFill" stroke="none"/>
            <path d="M4 6C4 5.44772 4.44772 5 5 5C5.55228 5 6 5.44772 6 6C6 6.55228 5.55228 7 5 7C4.44772 7 4 6.55228 4 6Z" fill="currentFill" stroke="none"/>
          </svg>
          <svg v-if="view == 'grid'" xmlns="http://www.w3.org/2000/svg"
               :class="(!searchQuery.length) ? 'cursor-pointer stroke-[#938F99] fill-[#938F99] hover:fill-[#77FF85] hover:stroke-[#77FF85]' : ''"
               class="w-6 h-6 p-[3px] justify-center items-center inline-flex"
               width="18" height="18" viewBox="0 0 18 18">
            <rect x="1" y="1" width="16" height="16" rx="1" stroke="currentStroke" stroke-width="2" fill="none"/>
            <path d="M4 5C4 4.44772 4.44772 4 5 4H7C7.55228 4 8 4.44772 8 5V7C8 7.55228 7.55228 8 7 8H5C4.44772 8 4 7.55228 4 7V5Z" fill="currentFill" stroke="none"/>
            <path d="M4 11C4 10.4477 4.44772 10 5 10H7C7.55228 10 8 10.4477 8 11V13C8 13.5523 7.55228 14 7 14H5C4.44772 14 4 13.5523 4 13V11Z" fill="currentFill" stroke="none"/>
            <path d="M10 5C10 4.44772 10.4477 4 11 4H13C13.5523 4 14 4.44772 14 5V7C14 7.55228 13.5523 8 13 8H11C10.4477 8 10 7.55228 10 7V5Z" fill="currentFill" stroke="none"/>
            <path d="M10 11C10 10.4477 10.4477 10 11 10H13C13.5523 10 14 10.4477 14 11V13C14 13.5523 13.5523 14 13 14H11C10.4477 14 10 13.5523 10 13V11Z" fill="currentFill" stroke="none"/>
          </svg>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VFToolbar'
};
</script>

<script setup>
import {inject, ref} from 'vue';

const emitter = inject('emitter')

const usePropDarkMode = inject('usePropDarkMode')

const {getStore, setStore} = inject('storage')

const {t} = inject('i18n');

const view = ref(getStore('viewport', 'grid'));

const selectedItems = ref([]);

const fullScreen = ref(getStore('full-screen', false));

const props = defineProps({
  data: Object
});

const searchQuery = ref('');

emitter.on('vf-search-query', ({newQuery}) => {
  searchQuery.value = newQuery;
});

const loadingState= inject('loadingState');
const isLoading = () => loadingState.value;

const setFullScreen = () => {
  fullScreen.value = !fullScreen.value;
  emitter.emit('vf-fullscreen-toggle');
}

emitter.on('vf-nodes-selected', (items) => {
  selectedItems.value = items;
})

emitter.on('vf-view-toggle', (newView) => {
  setStore('viewport', newView)
  view.value = newView;
})
</script>

<template>
  <div class="flex p-1.5 bg-neutral-100 dark:bg-zinc-900 items-center select-none  text-xs">
    <span v-if="false" :aria-label="t('Go up a directory')" data-microtip-position="bottom-right" role="tooltip">
      <svg
          @dragover="handleDragOver($event)"
          @drop="handleDropZone($event)"
          @click="!isGoUpAvailable() || emitter.emit('vf-fetch', {params:{q: 'index', adapter: data.adapter, path:breadcrumb[breadcrumb.length-2]?.path ?? (adapter + '://')}} )"
          class="h-6 w-6 p-0.5 rounded"
          :class="isGoUpAvailable() ? 'text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-zinc-800 cursor-pointer' : 'text-gray-400 dark:text-neutral-500'"
          xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </span>
    <span v-else-if="false" :aria-label="t('Refresh')" data-microtip-position="bottom-right" role="tooltip" v-if="!isLoading()">
      <svg @click="emitter.emit('vf-fetch',{params:{q: 'index', adapter: data.adapter, path: data.dirname}} );" class="h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 580 580" fill="currentColor">
        <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"></path>
      </svg>
    </span>
    <span v-else-if="false" :aria-label="t('Cancel')" data-microtip-position="bottom-right" role="tooltip">
      <svg @click="emitter.emit('vf-fetch-abort')" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>

    <div v-if="!searchMode" class="group flex bg-white dark:bg-zinc-800 items-center rounded p-1 ml-2 w-full min-h-[32px] rounded-[28px] pl-3" @click.self="enterSearchMode">
      <svg @click="emitter.emit('vf-fetch', {params:{q: 'index', adapter: data.adapter, gotoFolder: true}})"
           class="h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer"
           xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>

      <div class="flex leading-5 max-w-[530px] overflow-auto">
        <div v-for="(item, index) in breadcrumb" :key="index" class="flex">
          <span class="inline-flex mx-0.5 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 11.6875H15.8881L11.3463 7.14562L12.5 6L19 12.5L12.5 19L11.3544 17.8544L15.8881 13.3125H6V11.6875Z" fill="#49454F"/>
            </svg>
          </span>
          <span class="px-1.5 py-1 text-slate-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded min-w-[90px] cursor-pointer" :title="formatFilename(item.basename, 20)" @click="emitter.emit('vf-fetch', {params:{q: 'index', adapter: data.adapter, path:item.path, gotoFolder: true}})">{{ formatFilename(item.basename, 20) }}</span>
        </div>
      </div>

      <svg class="animate-spin p-1 h-6 w-6 text-white ml-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  v-if="isLoading()">
        <circle class="opacity-25 stroke-blue-900 dark:stroke-blue-100" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    <div v-else class="relative flex bg-white dark:bg-zinc-800 items-center rounded p-1 ml-2 w-full min-h-[32px] rounded-[28px] pl-3 pr-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="h-6 w-6 p-1 m-auto">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.7238 8.87193L14 12.1481L13.1481 13L9.87193 9.72384C9.26015 10.1641 8.52258 10.4328 7.71641 10.4328C5.66381 10.4328 4 8.76901 4 6.71641C4 4.66381 5.66381 3 7.71641 3C9.76901 3 11.4328 4.66381 11.4328 6.71641C11.4328 7.52258 11.1641 8.26015 10.7238 8.87193ZM7.71641 4.14351C6.29274 4.14351 5.14351 5.29274 5.14351 6.71641C5.14351 8.14008 6.29274 9.28931 7.71641 9.28931C9.14008 9.28931 10.2893 8.14008 10.2893 6.71641C10.2893 5.29274 9.14008 4.14351 7.71641 4.14351Z" fill="#CAC4D0"/>
      </svg>
      <div class="w-full"></div>
      <input
          ref="searchInput"
          @keydown.esc="exitSearchMode"
          @blur="handleBlur"
          v-model="query"
          :placeholder="t('Search anything..')"
          class="absolute ml-4  pb-0 px-2 border-0 ring-0 outline-0 text-gray-600 focus:ring-transparent focus:border-transparent dark:focus:ring-transparent dark:focus:border-transparent dark:text-gray-300 bg-transparent"
          type="text">
      <svg
          class="w-6 h-6 cursor-pointer"
          @click="exitSearchMode"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  </div>
</template>


<script>
export default {
  name: 'VFBreadcrumb',
};
</script>

<script setup>

import {inject, nextTick, ref, watch} from 'vue';
import useDebouncedRef from '../composables/useDebouncedRef.js';
import {formatFilename} from "~/utils/formatFilename";

const emitter = inject('emitter');
const { getStore } = inject('storage');
const adapter = inject('adapter');
const dirname = ref(null);
const breadcrumb = ref([]);
const searchMode = ref(false);
const searchInput = ref(null);

const props = defineProps({
  data: Object,
  currentWalletId: String
});

const {t} = inject('i18n');
const loadingState= inject('loadingState');

emitter.on('vf-explorer-update', () => {
  let items = [], links = [];
  dirname.value = props.data.dirname ?? (adapter.value + '://');

  if (dirname.value.length == 0) {
    breadcrumb.value = [];
  }
  dirname.value
      .replace(adapter.value + '://', '')
      .replace(props.currentWalletId + '/', '')
      .split('/')
      .forEach(function (item) {
        items.push(item);
        if (items.join('/') != '' && item) {
          links.push({
            'basename': item,
            'name': item,
            'path': adapter.value + '://' + items.join('/'),
            'type': 'dir'
          });
        }
      });

  if (links.length > 4) {
    links = links.slice(-5);
    links[0].name = '..';
  }

  breadcrumb.value = links;
});

const exitSearchMode = () => {
  searchMode.value = false;
  query.value = '';
}

emitter.on('vf-search-exit', () => {
  exitSearchMode();
});

const enterSearchMode = () => {
  searchMode.value = true;
  nextTick(() => searchInput.value.focus())
}

const query = useDebouncedRef('', 400);

const isLoading = () => loadingState.value;

watch(query, newQuery => {
  emitter.emit('vf-toast-clear');
  emitter.emit('vf-search-query', {newQuery});
});

const isGoUpAvailable = () => {
  return breadcrumb.value.length && !searchMode.value;
};

const handleDropZone = (e) => {
  e.preventDefault();
  let draggedItems = JSON.parse(e.dataTransfer.getData('items'));

  if (draggedItems.find(item => item.storage != adapter.value)) {
    alert('Moving items between different storages is not supported yet.');
    return;
  }

  emitter.emit('vf-modal-show', {
    type: 'move',
    items: {from: draggedItems, to: breadcrumb.value[breadcrumb.value.length - 2] ?? {path: (adapter.value + '://')}}
  });
};

const handleDragOver = (e) => {
  e.preventDefault();

  if (isGoUpAvailable()) {
    e.dataTransfer.dropEffect = 'copy';
  } else {
    e.dataTransfer.dropEffect = 'none';
    e.dataTransfer.effectAllowed = 'none';
  }
};

const handleBlur = () => {
  if (query.value == '') {
    exitSearchMode();
  }
}
</script>



<template>
  <div class="relative flex-auto flex flex-col overflow-hidden">

    <div v-if="view=='list' || searchQuery.length" class="grid grid-cols-12 bg-[#D0BCFF1F] text-neutral-400 rounded-[5px] ml-4 mr-2 text-sm select-none">
        <div @click="sortBy('basename')" :class="searchQuery.length ? 'col-span-7' : 'col-span-9'" class="py-1 leading-6 hover:bg-neutral-100  dark:hover:bg-gray-700/10 flex items-center pl-1">
          {{ t('Name') }}
            <v-f-sort-icon :direction="sort.order=='asc'? 'down': 'up'" v-show="sort.active && sort.column=='basename'" />
        </div>
        <div v-if="!searchQuery.length" @click="sortBy('file_size')" class="col-span-2 py-1 leading-6 hover:bg-neutral-100 dark:hover:bg-gray-700/10 flex items-center justify-center border-l border-r dark:border-gray-700">
          {{ t('Size') }}
          <v-f-sort-icon :direction="sort.order=='asc'? 'down': 'up'"  v-show="sort.active && sort.column=='file_size'" />
        </div>
        <div v-if="!searchQuery.length" @click="sortBy('health')" class="col-span-1 py-1 leading-6 hover:bg-neutral-100 dark:hover:bg-gray-700/10 flex items-center justify-center">
          {{ t('Health') }}
          <v-f-sort-icon :direction="sort.order=='asc'? 'down': 'up'"  v-show="sort.active && sort.column=='health'" />
        </div>
        <div v-if="searchQuery.length" @click="sortBy('path')" class="col-span-5 py-1 leading-6 hover:bg-neutral-100  dark:hover:bg-gray-700/10 flex items-center justify-center border-l dark:border-gray-700">
          {{ t('Path') }}
            <v-f-sort-icon :direction="sort.order=='asc'? 'down': 'up'"  v-show="sort.active && sort.column=='path'" />
        </div>
      </div>

    <div class="absolute">
      <div ref="dragImage"  class="absolute -z-50 -top-96">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute h-6 w-6 md:h-12 md:w-12 m-auto stroke-neutral-500 fill-white dark:fill-gray-700 dark:stroke-gray-600 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <div class="text-neutral-700 dark:text-neutral-300 p-1 absolute text-center top-4 right-[-2rem] md:top-5 md:right-[-2.4rem] z-20 text-xs">{{ selectedCount }}</div>
      </div>
    </div>

    <div class="flex flex-row h-full">
      <transition name="fade" mode="out-in">
      <div v-if="uploadingFiles && uploadingFiles.length" class="w-[555px] h-6 absolute rounded-[28px] border border-neutral-800 ml-3.5">
        <div class="w-44 h-6 p-1 left-0 top-0 absolute justify-start items-center gap-1 inline-flex">
          <div class="grow shrink basis-0 h-6 px-2 justify-start items-center gap-2 flex">
            <div class="w-4 h-4 rounded-full animate-spin border-2 border-solid border-spinner-500 border-t-transparent"></div>
            <div class="text-neutral-400 text-xs font-normal font-['Roboto'] leading-normal tracking-wide">Uploading {{uploadingFiles.length}} files</div>
          </div>
        </div>
      </div>
      </transition>
      <div
          @touchstart="handleTouchStart"
          @contextmenu.self.prevent="emitter.emit('vf-contextmenu-show',{event: $event, area: selectorArea, items: getSelectedItems()})"
          :class="[showFileInfo ? 'w-[300px]' : 'w-full', searchQuery.length || view ==='list' ? 'ml-[10px]' : '']"
          class="h-full text-xs vf-selector-area min-h-[150px] overflow-auto p-1 pt-3 z-0 "
          ref="selectorArea">

        <div
             v-if="searchQuery.length"
             @dblclick="openItem(item)"
             @touchstart="delayedOpenItem($event)"
             @touchend="clearTimeOut()"
             @mouseenter="handleMouseEnter($event,item)"
             @mouseleave="handleMouseLeave($event,item)"
             @contextmenu.prevent="emitter.emit('vf-contextmenu-show', {event: $event, area: selectorArea, items: getSelectedItems(), target: item })"
             :class="'vf-item-' + randId"
             class="grid grid-cols-1 border text-[#CAC4D0] fill-[#4F378B] hover:text-[#77FF85] hover:fill-[#77FF85] border-transparent w-full select-none "
             v-for="(item, index) in getItems()" :data-type="item.type" :data-item="JSON.stringify(item)" :data-index="index">
            <div class="grid grid-cols-12 items-center">
              <div class="flex col-span-7 items-center border-b border-[#49454F] h-[26px] mt-[2px] mb-[2px]">
                <div class="w-5 mr-1">
                  <svg v-if="item.type === 'dir' && item.hover"  xmlns="http://www.w3.org/2000/svg"
                       class="fill-[#77FF85]"
                       width="16" height="16" viewBox="0 0 16 16">
                    <g clip-path="url(#clip0_496_2843)">
                      <path d="M13.1786 2.50895H8.17859L6.92859 0.678589H3.17859C2.49109 0.678589 1.92859 1.50225 1.92859 2.50895V13.4911C1.92859 14.4978 2.49109 15.3214 3.17859 15.3214H13.1786C13.8661 15.3214 14.4286 14.4978 14.4286 13.4911V4.3393C14.4286 3.33261 13.8661 2.50895 13.1786 2.50895Z" fill="currentFill"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_496_2843">
                        <rect width="15" height="15" fill="white" transform="translate(0.5 0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <svg v-else-if="item.type === 'dir' && (item.selected || setSelectedIcon(item))"  xmlns="http://www.w3.org/2000/svg"
                       class="fill-[#BEA9EE]"
                       width="16" height="16" viewBox="0 0 16 16">
                    <g clip-path="url(#clip0_496_2843)">
                      <path d="M13.1786 2.50895H8.17859L6.92859 0.678589H3.17859C2.49109 0.678589 1.92859 1.50225 1.92859 2.50895V13.4911C1.92859 14.4978 2.49109 15.3214 3.17859 15.3214H13.1786C13.8661 15.3214 14.4286 14.4978 14.4286 13.4911V4.3393C14.4286 3.33261 13.8661 2.50895 13.1786 2.50895Z" fill="currentFill"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_496_2843">
                        <rect width="15" height="15" fill="white" transform="translate(0.5 0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <svg v-else-if="item.type === 'dir'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" >
                    <g clip-path="url(#clip0_496_2843)">
                      <path d="M13.1786 2.50895H8.17859L6.92859 0.678589H3.17859C2.49109 0.678589 1.92859 1.50225 1.92859 2.50895V13.4911C1.92859 14.4978 2.49109 15.3214 3.17859 15.3214H13.1786C13.8661 15.3214 14.4286 14.4978 14.4286 13.4911V4.3393C14.4286 3.33261 13.8661 2.50895 13.1786 2.50895Z" fill="currentFill"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_496_2843">
                        <rect width="15" height="15" fill="white" transform="translate(0.5 0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <svg v-else-if="item.type === 'file' && item.hover" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <g clip-path="url(#clip0_496_2862)">
                      <path d="M10.9285 1.0122L11.2857 0.646341L11.1428 0.5H10.9285V1.0122ZM13.8571 4.0122H14.3571V3.79268L14.2143 3.64634L13.8571 4.0122ZM12.8928 14.5122H3.10711V15.5H12.8571V14.5122H12.8928ZM2.64282 14V2H1.64282V14H2.64282ZM3.10711 1.4878H10.9285V0.5H3.10711V1.4878ZM13.3571 4.0122V14H14.3214V4.0122H13.3571ZM10.5714 1.34146L13.5 4.34146L14.1785 3.64634L11.25 0.646341L10.5714 1.34146ZM3.10711 14.5122C2.96425 14.5122 2.85711 14.4756 2.74997 14.3659C2.64282 14.2561 2.60711 14.1463 2.60711 14H1.64282C1.64282 14.4024 1.78568 14.7683 2.07139 15.061C2.35711 15.3537 2.71425 15.5 3.10711 15.5V14.5122ZM12.8928 15.5C13.2857 15.5 13.6428 15.3537 13.9285 15.061C14.2142 14.7683 14.3571 14.4024 14.3571 14H13.3571C13.3571 14.1463 13.3214 14.2561 13.2142 14.3659C13.1071 14.4756 13 14.5122 12.8571 14.5122V15.5H12.8928ZM2.64282 2C2.64282 1.85366 2.67854 1.7439 2.78568 1.63415C2.89282 1.52439 2.99996 1.4878 3.14282 1.4878V0.5C2.71425 0.5 2.35711 0.646341 2.07139 0.939024C1.82139 1.23171 1.64282 1.59756 1.64282 2H2.64282Z" fill="#77FF85"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_496_2862">
                        <rect width="15" height="15" fill="white" transform="translate(0.5 0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <svg v-else-if="item.type === 'file' && (item.selected || setSelectedIcon(item))" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <g clip-path="url(#clip0_496_2862)">
                      <path d="M10.9285 1.0122L11.2857 0.646341L11.1428 0.5H10.9285V1.0122ZM13.8571 4.0122H14.3571V3.79268L14.2143 3.64634L13.8571 4.0122ZM12.8928 14.5122H3.10711V15.5H12.8571V14.5122H12.8928ZM2.64282 14V2H1.64282V14H2.64282ZM3.10711 1.4878H10.9285V0.5H3.10711V1.4878ZM13.3571 4.0122V14H14.3214V4.0122H13.3571ZM10.5714 1.34146L13.5 4.34146L14.1785 3.64634L11.25 0.646341L10.5714 1.34146ZM3.10711 14.5122C2.96425 14.5122 2.85711 14.4756 2.74997 14.3659C2.64282 14.2561 2.60711 14.1463 2.60711 14H1.64282C1.64282 14.4024 1.78568 14.7683 2.07139 15.061C2.35711 15.3537 2.71425 15.5 3.10711 15.5V14.5122ZM12.8928 15.5C13.2857 15.5 13.6428 15.3537 13.9285 15.061C14.2142 14.7683 14.3571 14.4024 14.3571 14H13.3571C13.3571 14.1463 13.3214 14.2561 13.2142 14.3659C13.1071 14.4756 13 14.5122 12.8571 14.5122V15.5H12.8928ZM2.64282 2C2.64282 1.85366 2.67854 1.7439 2.78568 1.63415C2.89282 1.52439 2.99996 1.4878 3.14282 1.4878V0.5C2.71425 0.5 2.35711 0.646341 2.07139 0.939024C1.82139 1.23171 1.64282 1.59756 1.64282 2H2.64282Z" fill="#BEA9EE"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_496_2862">
                        <rect width="15" height="15" fill="white" transform="translate(0.5 0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <g clip-path="url(#clip0_496_2862)">
                      <path d="M10.9285 1.0122L11.2857 0.646341L11.1428 0.5H10.9285V1.0122ZM13.8571 4.0122H14.3571V3.79268L14.2143 3.64634L13.8571 4.0122ZM12.8928 14.5122H3.10711V15.5H12.8571V14.5122H12.8928ZM2.64282 14V2H1.64282V14H2.64282ZM3.10711 1.4878H10.9285V0.5H3.10711V1.4878ZM13.3571 4.0122V14H14.3214V4.0122H13.3571ZM10.5714 1.34146L13.5 4.34146L14.1785 3.64634L11.25 0.646341L10.5714 1.34146ZM3.10711 14.5122C2.96425 14.5122 2.85711 14.4756 2.74997 14.3659C2.64282 14.2561 2.60711 14.1463 2.60711 14H1.64282C1.64282 14.4024 1.78568 14.7683 2.07139 15.061C2.35711 15.3537 2.71425 15.5 3.10711 15.5V14.5122ZM12.8928 15.5C13.2857 15.5 13.6428 15.3537 13.9285 15.061C14.2142 14.7683 14.3571 14.4024 14.3571 14H13.3571C13.3571 14.1463 13.3214 14.2561 13.2142 14.3659C13.1071 14.4756 13 14.5122 12.8571 14.5122V15.5H12.8928ZM2.64282 2C2.64282 1.85366 2.67854 1.7439 2.78568 1.63415C2.89282 1.52439 2.99996 1.4878 3.14282 1.4878V0.5C2.71425 0.5 2.35711 0.646341 2.07139 0.939024C1.82139 1.23171 1.64282 1.59756 1.64282 2H2.64282Z" fill="currentFill"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_496_2862">
                        <rect width="15" height="15" fill="white" transform="translate(0.5 0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <svg v-if="item.status==='uploading'" aria-hidden="true" class="vf-item-spinner w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                </div>
                <span class="overflow-ellipsis overflow-hidden whitespace-nowrap uppercase leading-[24px] text-[14px] font-['Roboto'] hover:text-[#77FF85]"
                      :class="{'text-[#BEA9EE]': item.selected || setSelectedIcon(item) }">
                  {{item.basename }}</span>
              </div>
              <div class="col-span-5 overflow-ellipsis overflow-hidden whitespace-nowrap uppercase text-[#CAC4D0] leading-[24px] text-[14px] font-['Roboto']">{{ item.visible_path }}</div>
            </div>
        </div>

        <div draggable="true"
             v-if="view=='list' && !searchQuery.length"
             @dblclick="openItem(item)"
             @touchstart="delayedOpenItem($event)"
             @touchend="clearTimeOut()"
             @contextmenu.prevent="emitter.emit('vf-contextmenu-show', {event: $event, area: selectorArea, items: getSelectedItems(), target: item })"
             @dragstart="handleDragStart($event,item)"
             @dragover="handleDragOver($event,item)"
             @drop="handleDropZone($event,item)"
             @mouseenter="handleMouseEnter($event,item)"
             @mouseleave="handleMouseLeave($event,item)"
             :class="'vf-item-' + randId"
             class="grid grid-cols-1 border text-[#CAC4D0] fill-[#4F378B] hover:text-[#77FF85] hover:fill-[#77FF85] border-transparent w-full select-none"
             v-for="(item, index) in getItems()" :data-type="item.type" :data-item="JSON.stringify(item)" :data-index="index">
            <div class="grid grid-cols-12 items-center">
              <div class="flex col-span-9 items-center border-b border-[#49454F] h-[26px] mt-[2px] mb-[2px]">
                <div class="w-5 mr-1">
                  <svg v-if="item.type === 'dir' && item.hover"  xmlns="http://www.w3.org/2000/svg"
                       class="fill-[#77FF85]"
                       width="16" height="16" viewBox="0 0 16 16">
                    <g clip-path="url(#clip0_496_2843)">
                      <path d="M13.1786 2.50895H8.17859L6.92859 0.678589H3.17859C2.49109 0.678589 1.92859 1.50225 1.92859 2.50895V13.4911C1.92859 14.4978 2.49109 15.3214 3.17859 15.3214H13.1786C13.8661 15.3214 14.4286 14.4978 14.4286 13.4911V4.3393C14.4286 3.33261 13.8661 2.50895 13.1786 2.50895Z" fill="currentFill"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_496_2843">
                        <rect width="15" height="15" fill="white" transform="translate(0.5 0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <svg v-else-if="item.type === 'dir' && (item.selected || setSelectedIcon(item))"  xmlns="http://www.w3.org/2000/svg"
                       class="fill-[#BEA9EE]"
                       width="16" height="16" viewBox="0 0 16 16">
                    <g clip-path="url(#clip0_496_2843)">
                      <path d="M13.1786 2.50895H8.17859L6.92859 0.678589H3.17859C2.49109 0.678589 1.92859 1.50225 1.92859 2.50895V13.4911C1.92859 14.4978 2.49109 15.3214 3.17859 15.3214H13.1786C13.8661 15.3214 14.4286 14.4978 14.4286 13.4911V4.3393C14.4286 3.33261 13.8661 2.50895 13.1786 2.50895Z" fill="currentFill"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_496_2843">
                        <rect width="15" height="15" fill="white" transform="translate(0.5 0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <svg v-else-if="item.type === 'dir'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" >
                    <g clip-path="url(#clip0_496_2843)">
                      <path d="M13.1786 2.50895H8.17859L6.92859 0.678589H3.17859C2.49109 0.678589 1.92859 1.50225 1.92859 2.50895V13.4911C1.92859 14.4978 2.49109 15.3214 3.17859 15.3214H13.1786C13.8661 15.3214 14.4286 14.4978 14.4286 13.4911V4.3393C14.4286 3.33261 13.8661 2.50895 13.1786 2.50895Z" fill="currentFill"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_496_2843">
                        <rect width="15" height="15" fill="white" transform="translate(0.5 0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <svg v-else-if="item.type === 'file' && item.hover" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <g clip-path="url(#clip0_496_2862)">
                      <path d="M10.9285 1.0122L11.2857 0.646341L11.1428 0.5H10.9285V1.0122ZM13.8571 4.0122H14.3571V3.79268L14.2143 3.64634L13.8571 4.0122ZM12.8928 14.5122H3.10711V15.5H12.8571V14.5122H12.8928ZM2.64282 14V2H1.64282V14H2.64282ZM3.10711 1.4878H10.9285V0.5H3.10711V1.4878ZM13.3571 4.0122V14H14.3214V4.0122H13.3571ZM10.5714 1.34146L13.5 4.34146L14.1785 3.64634L11.25 0.646341L10.5714 1.34146ZM3.10711 14.5122C2.96425 14.5122 2.85711 14.4756 2.74997 14.3659C2.64282 14.2561 2.60711 14.1463 2.60711 14H1.64282C1.64282 14.4024 1.78568 14.7683 2.07139 15.061C2.35711 15.3537 2.71425 15.5 3.10711 15.5V14.5122ZM12.8928 15.5C13.2857 15.5 13.6428 15.3537 13.9285 15.061C14.2142 14.7683 14.3571 14.4024 14.3571 14H13.3571C13.3571 14.1463 13.3214 14.2561 13.2142 14.3659C13.1071 14.4756 13 14.5122 12.8571 14.5122V15.5H12.8928ZM2.64282 2C2.64282 1.85366 2.67854 1.7439 2.78568 1.63415C2.89282 1.52439 2.99996 1.4878 3.14282 1.4878V0.5C2.71425 0.5 2.35711 0.646341 2.07139 0.939024C1.82139 1.23171 1.64282 1.59756 1.64282 2H2.64282Z" fill="#77FF85"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_496_2862">
                        <rect width="15" height="15" fill="white" transform="translate(0.5 0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <svg v-else-if="item.type === 'file' && (item.selected || setSelectedIcon(item))" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <g clip-path="url(#clip0_496_2862)">
                      <path d="M10.9285 1.0122L11.2857 0.646341L11.1428 0.5H10.9285V1.0122ZM13.8571 4.0122H14.3571V3.79268L14.2143 3.64634L13.8571 4.0122ZM12.8928 14.5122H3.10711V15.5H12.8571V14.5122H12.8928ZM2.64282 14V2H1.64282V14H2.64282ZM3.10711 1.4878H10.9285V0.5H3.10711V1.4878ZM13.3571 4.0122V14H14.3214V4.0122H13.3571ZM10.5714 1.34146L13.5 4.34146L14.1785 3.64634L11.25 0.646341L10.5714 1.34146ZM3.10711 14.5122C2.96425 14.5122 2.85711 14.4756 2.74997 14.3659C2.64282 14.2561 2.60711 14.1463 2.60711 14H1.64282C1.64282 14.4024 1.78568 14.7683 2.07139 15.061C2.35711 15.3537 2.71425 15.5 3.10711 15.5V14.5122ZM12.8928 15.5C13.2857 15.5 13.6428 15.3537 13.9285 15.061C14.2142 14.7683 14.3571 14.4024 14.3571 14H13.3571C13.3571 14.1463 13.3214 14.2561 13.2142 14.3659C13.1071 14.4756 13 14.5122 12.8571 14.5122V15.5H12.8928ZM2.64282 2C2.64282 1.85366 2.67854 1.7439 2.78568 1.63415C2.89282 1.52439 2.99996 1.4878 3.14282 1.4878V0.5C2.71425 0.5 2.35711 0.646341 2.07139 0.939024C1.82139 1.23171 1.64282 1.59756 1.64282 2H2.64282Z" fill="#BEA9EE"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_496_2862">
                        <rect width="15" height="15" fill="white" transform="translate(0.5 0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <g clip-path="url(#clip0_496_2862)">
                      <path d="M10.9285 1.0122L11.2857 0.646341L11.1428 0.5H10.9285V1.0122ZM13.8571 4.0122H14.3571V3.79268L14.2143 3.64634L13.8571 4.0122ZM12.8928 14.5122H3.10711V15.5H12.8571V14.5122H12.8928ZM2.64282 14V2H1.64282V14H2.64282ZM3.10711 1.4878H10.9285V0.5H3.10711V1.4878ZM13.3571 4.0122V14H14.3214V4.0122H13.3571ZM10.5714 1.34146L13.5 4.34146L14.1785 3.64634L11.25 0.646341L10.5714 1.34146ZM3.10711 14.5122C2.96425 14.5122 2.85711 14.4756 2.74997 14.3659C2.64282 14.2561 2.60711 14.1463 2.60711 14H1.64282C1.64282 14.4024 1.78568 14.7683 2.07139 15.061C2.35711 15.3537 2.71425 15.5 3.10711 15.5V14.5122ZM12.8928 15.5C13.2857 15.5 13.6428 15.3537 13.9285 15.061C14.2142 14.7683 14.3571 14.4024 14.3571 14H13.3571C13.3571 14.1463 13.3214 14.2561 13.2142 14.3659C13.1071 14.4756 13 14.5122 12.8571 14.5122V15.5H12.8928ZM2.64282 2C2.64282 1.85366 2.67854 1.7439 2.78568 1.63415C2.89282 1.52439 2.99996 1.4878 3.14282 1.4878V0.5C2.71425 0.5 2.35711 0.646341 2.07139 0.939024C1.82139 1.23171 1.64282 1.59756 1.64282 2H2.64282Z" fill="currentFill"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_496_2862">
                        <rect width="15" height="15" fill="white" transform="translate(0.5 0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <svg v-if="item.status==='uploading'" aria-hidden="true" class="vf-item-spinner w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                </div>
                <span class="overflow-ellipsis overflow-hidden whitespace-nowrap uppercase leading-[24px] text-[14px] font-['Roboto'] hover:text-[#77FF85]"
                      :class="{'text-[#BEA9EE]': item.selected || setSelectedIcon(item) }">
                  {{item.basename }}</span>
              </div>
              <div class="col-span-2 text-center uppercase text-[#CAC4D0] leading-[24px] text-[14px] font-['Roboto'] border-b border-[#49454F] h-[26px] mt-[2px] mb-[2px]">{{ item.file_size ? filesize(item.file_size) : '' }}</div>
              <div class="col-span-1 overflow-ellipsis overflow-hidden whitespace-nowrap uppercase text-[#CAC4D0] leading-[24px] text-[14px] font-['Roboto'] border-b border-[#49454F] h-[26px] mt-[2px] mb-[2px]">{{ item.health > 0.5 ? 'Good' : 'Bad' }}</div>
            </div>
        </div>

        <div draggable="true"
             v-if="view=='grid' && !searchQuery.length"
             @dblclick="openItem(item)"
             @touchstart="delayedOpenItem($event)"
             @touchend="clearTimeOut()"
             @contextmenu.prevent="emitter.emit('vf-contextmenu-show', {event: $event, area: selectorArea, items: getSelectedItems(), target: item })"
             @dragstart="handleDragStart($event,item)"
             @dragover="handleDragOver($event,item)"
             @mouseenter="handleMouseEnter($event,item)"
             @mouseleave="handleMouseLeave($event,item)"
             @drop="handleDropZone($event,item)"
             :class="'vf-item-' + randId"
             class="border border-transparent m-1 mt-4 inline-flex w-[5.5rem] h-20 md:w-24 text-center justify-center select-none cursor-pointer"
             v-for="(item, index) in getItems(false)" :data-type="item.type" :data-item="JSON.stringify(item)" :data-index="index">
            <div>
              <div class="relative mb-2">
                <svg v-if="item.type === 'dir' && item.hover"  xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 md:h-12 md:w-12 m-auto" viewBox="0 0 42 42" fill="none">
                  <path d="M35.5 5.625H21.5L18 0.5H7.5C5.575 0.5 4 2.80625 4 5.625V36.375C4 39.1937 5.575 41.5 7.5 41.5H35.5C37.425 41.5 39 39.1937 39 36.375V10.75C39 7.93125 37.425 5.625 35.5 5.625Z" fill="#77FF85"/>
                </svg>
                <svg v-else-if="item.type === 'dir' && (item.selected || setSelectedIcon(item))"  xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 md:h-12 md:w-12 m-auto" viewBox="0 0 42 42" fill="none">
                  <path d="M35.5 5.625H21.5L18 0.5H7.5C5.575 0.5 4 2.80625 4 5.625V36.375C4 39.1937 5.575 41.5 7.5 41.5H35.5C37.425 41.5 39 39.1937 39 36.375V10.75C39 7.93125 37.425 5.625 35.5 5.625Z" fill="#BEA9EE"/>
                </svg>
                <svg v-else-if="item.type === 'dir'"  xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 md:h-12 md:w-12 m-auto" viewBox="0 0 42 42" fill="none">
                  <path d="M35.5 5.625H21.5L18 0.5H7.5C5.575 0.5 4 2.80625 4 5.625V36.375C4 39.1937 5.575 41.5 7.5 41.5H35.5C37.425 41.5 39 39.1937 39 36.375V10.75C39 7.93125 37.425 5.625 35.5 5.625Z" fill="#4F378B"/>
                </svg>
                <img class="lazy h-10 md:h-12 m-auto" v-else-if="(item.mime_type ?? '').startsWith('image')" :data-src="getImageUrl(adapter.value, item.path)"  :alt="item.basename">
                <svg v-if="item.type === 'file' && item.hover" xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 md:h-12 md:w-12 m-auto text-neutral-500" viewBox="0 0 42 42" fill="none">
                  <path d="M29.2002 1.43415L30.2002 0.409756L29.8002 0H29.2002V1.43415ZM37.4002 9.83415H38.8002V9.21951L38.4002 8.80976L37.4002 9.83415ZM34.7002 39.2341H7.3002V42H34.6002V39.2341H34.7002ZM6.0002 37.8V4.2H3.2002V37.8H6.0002ZM7.3002 2.76585H29.2002V0H7.3002V2.76585ZM36.0002 9.83415V37.8H38.7002V9.83415H36.0002ZM28.2002 2.3561L36.4002 10.7561L38.3002 8.80976L30.1002 0.409756L28.2002 2.3561ZM7.3002 39.2341C6.9002 39.2341 6.6002 39.1317 6.3002 38.8244C6.0002 38.5171 5.9002 38.2098 5.9002 37.8H3.2002C3.2002 38.9268 3.6002 39.9512 4.4002 40.7707C5.2002 41.5902 6.2002 42 7.3002 42V39.2341ZM34.7002 42C35.8002 42 36.8002 41.5902 37.6002 40.7707C38.4002 39.9512 38.8002 38.9268 38.8002 37.8H36.0002C36.0002 38.2098 35.9002 38.5171 35.6002 38.8244C35.3002 39.1317 35.0002 39.2341 34.6002 39.2341V42H34.7002ZM6.0002 4.2C6.0002 3.79024 6.1002 3.48293 6.4002 3.17561C6.7002 2.86829 7.0002 2.76585 7.4002 2.76585V0C6.2002 0 5.2002 0.409756 4.4002 1.22927C3.7002 2.04878 3.2002 3.07317 3.2002 4.2H6.0002Z" fill="#77FF85"/>
                </svg>
                <svg v-else-if="item.type === 'file' && (item.selected || setSelectedIcon(item))" xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 md:h-12 md:w-12 m-auto text-neutral-500" viewBox="0 0 42 42" fill="none">
                  <path d="M29.2002 1.43415L30.2002 0.409756L29.8002 0H29.2002V1.43415ZM37.4002 9.83415H38.8002V9.21951L38.4002 8.80976L37.4002 9.83415ZM34.7002 39.2341H7.3002V42H34.6002V39.2341H34.7002ZM6.0002 37.8V4.2H3.2002V37.8H6.0002ZM7.3002 2.76585H29.2002V0H7.3002V2.76585ZM36.0002 9.83415V37.8H38.7002V9.83415H36.0002ZM28.2002 2.3561L36.4002 10.7561L38.3002 8.80976L30.1002 0.409756L28.2002 2.3561ZM7.3002 39.2341C6.9002 39.2341 6.6002 39.1317 6.3002 38.8244C6.0002 38.5171 5.9002 38.2098 5.9002 37.8H3.2002C3.2002 38.9268 3.6002 39.9512 4.4002 40.7707C5.2002 41.5902 6.2002 42 7.3002 42V39.2341ZM34.7002 42C35.8002 42 36.8002 41.5902 37.6002 40.7707C38.4002 39.9512 38.8002 38.9268 38.8002 37.8H36.0002C36.0002 38.2098 35.9002 38.5171 35.6002 38.8244C35.3002 39.1317 35.0002 39.2341 34.6002 39.2341V42H34.7002ZM6.0002 4.2C6.0002 3.79024 6.1002 3.48293 6.4002 3.17561C6.7002 2.86829 7.0002 2.76585 7.4002 2.76585V0C6.2002 0 5.2002 0.409756 4.4002 1.22927C3.7002 2.04878 3.2002 3.07317 3.2002 4.2H6.0002Z" fill="#BEA9EE"/>
                </svg>
                <svg v-else-if="item.type === 'file'" xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 md:h-12 md:w-12 m-auto text-neutral-500" fill="none" viewBox="0 0 42 42" >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M29.2002 1.43415L30.2002 0.409756L29.8002 0H29.2002V1.43415ZM37.4002 9.83415H38.8002V9.21951L38.4002 8.80976L37.4002 9.83415ZM34.7002 39.2341H7.3002V42H34.6002V39.2341H34.7002ZM6.0002 37.8V4.2H3.2002V37.8H6.0002ZM7.3002 2.76585H29.2002V0H7.3002V2.76585ZM36.0002 9.83415V37.8H38.7002V9.83415H36.0002ZM28.2002 2.3561L36.4002 10.7561L38.3002 8.80976L30.1002 0.409756L28.2002 2.3561ZM7.3002 39.2341C6.9002 39.2341 6.6002 39.1317 6.3002 38.8244C6.0002 38.5171 5.9002 38.2098 5.9002 37.8H3.2002C3.2002 38.9268 3.6002 39.9512 4.4002 40.7707C5.2002 41.5902 6.2002 42 7.3002 42V39.2341ZM34.7002 42C35.8002 42 36.8002 41.5902 37.6002 40.7707C38.4002 39.9512 38.8002 38.9268 38.8002 37.8H36.0002C36.0002 38.2098 35.9002 38.5171 35.6002 38.8244C35.3002 39.1317 35.0002 39.2341 34.6002 39.2341V42H34.7002ZM6.0002 4.2C6.0002 3.79024 6.1002 3.48293 6.4002 3.17561C6.7002 2.86829 7.0002 2.76585 7.4002 2.76585V0C6.2002 0 5.2002 0.409756 4.4002 1.22927C3.7002 2.04878 3.2002 3.07317 3.2002 4.2H6.0002Z" fill="#4F378B"/>
                </svg>
                <div v-if="item.status==='uploading'" class="vf-item-spinner-small w-4 h-4 rounded-full animate-spin border-2 border-solid border-spinner-500 border-t-transparent"></div>
                <div class="absolute hidden md:block top-1/2 w-full text-center text-neutral-500" v-if="!(item.mime_type ?? '').startsWith('image') && item.type != 'dir'">{{ ext(item.extension) }}</div>
              </div>
              <span class="break-all vf-item-caption uppercase" :style="{color: item.hover ? '#77FF85' : (item.selected ? '#BEA9EE' : '#938F99')}">{{ title_shorten(item.basename) }}</span>
            </div>
        </div>

      </div>
      <div v-if="showFileInfo === true"
           :class="[searchQuery.length || view ==='list' ? 'w-[262px] pl-[14px]' : 'w-[272px] pl-[24px]']"
           class="absolute h-full dark:bg-zinc-900 right-0  p-1 pr-[24px] mt-2">
        <div class="w-[241px] h-[202px] flex-col justify-start items-start gap-2.5 inline-flex">
          <div class="justify-start items-start gap-[116px] inline-flex">
            <div class="w-28 text-zinc-700 text-sm font-semibold font-['Roboto'] leading-tight tracking-tight">File info</div>
            <svg @click="hideFileInfo" class="fill-zinc-700 hover:fill-accent-500 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M0 5.6875H9.88812L5.34625 1.14562L6.5 0L13 6.5L6.5 13L5.35437 11.8544L9.88812 7.3125H0V5.6875Z" fill="currentFill"/>
            </svg>
          </div>
          <div class="flex-col justify-start items-start gap-[5px] flex">
            <div class="justify-start items-start gap-[5px] inline-flex">
              <div class="text-violet-900 text-sm font-semibold font-['Roboto'] uppercase leading-tight tracking-tight">{{getSelectedItemFilename()}}</div>
            </div>
            <div class="dark:text-zinc-300 text-sm font-normal font-['Roboto'] leading-tight tracking-tight max-w-[230px] break-all">Path: {{getSelectedItemPath()}}</div>
            <div class="dark:text-zinc-300 text-sm font-normal font-['Roboto'] leading-tight tracking-tight">Size: {{getSelectedItemSize()}}</div>
            <div><span class="dark:text-zinc-300 text-sm font-normal font-['Roboto'] leading-tight tracking-tight">Health: </span><span class="text-emerald-500 text-sm font-normal font-['Roboto'] leading-tight tracking-tight">{{getSelectedItemHealth()}}</span></div>
          </div>
          <div class="w-[241px] justify-center items-center inline-flex">
            <div class="grow shrink basis-0 self-stretch flex-col justify-center items-start inline-flex">
              <div class="self-stretch h-[0px] border border-zinc-700"></div>
            </div>
          </div>
          <div class="justify-start items-start gap-2.5 inline-flex">
            <div @click="emitter.emit('vf-download', {q:'download', adapter: adapter, path: getSelectedItems()[0].path})" class="w-[115px] h-[35px] rounded-[100px] border border-neutral-400 flex-col justify-center items-center inline-flex cursor-pointer">
              <div class="self-stretch h-[31px] pl-4 pr-6 py-2.5 justify-center items-center gap-2 inline-flex">
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M12 16.5L7 11.5L8.4 10.05L11 12.65V4.5H13V12.65L15.6 10.05L17 11.5L12 16.5ZM6 20.5C5.45 20.5 4.97917 20.3042 4.5875 19.9125C4.19583 19.5208 4 19.05 4 18.5V15.5H6V18.5H18V15.5H20V18.5C20 19.05 19.8042 19.5208 19.4125 19.9125C19.0208 20.3042 18.55 20.5 18 20.5H6Z" fill="#E6E0E9"/>
                  </svg>
                </div>
                <div class="text-center text-zinc-200 text-xs font-semibold font-['Roboto'] leading-none tracking-wide">Download</div>
              </div>
            </div>
            <div @click="emitter.emit('vf-modal-show', {type:'delete', items: getSelectedItems()})" class="w-[115px] h-[35px] rounded-[100px] border border-neutral-400 flex-col justify-center items-center inline-flex cursor-pointer">
              <div class="w-[115px] h-[31px] pl-4 pr-6 py-2.5 justify-center items-center gap-2 inline-flex">
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <mask id="mask0_22_2716" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="25">
                      <rect y="0.5" width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_22_2716)">
                      <path d="M7 21.5C6.45 21.5 5.97917 21.3042 5.5875 20.9125C5.19583 20.5208 5 20.05 5 19.5V6.5H4V4.5H9V3.5H15V4.5H20V6.5H19V19.5C19 20.05 18.8042 20.5208 18.4125 20.9125C18.0208 21.3042 17.55 21.5 17 21.5H7ZM17 6.5H7V19.5H17V6.5ZM9 17.5H11V8.5H9V17.5ZM13 17.5H15V8.5H13V17.5Z" fill="#F2B8B5"/>
                    </g>
                  </svg>
                </div>
                <div class="text-center text-rose-300 text-xs font-semibold font-['Roboto'] leading-none tracking-wide">Delete</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-f-toast />
  </div>
</template>

<script>
export default {
  name: 'VFExplorer'
};
</script>

<script setup>
import {inject, nextTick, onMounted, onUpdated, reactive, ref, unref, watch} from 'vue';
import DragSelect from 'dragselect';
import filesize from './../utils/filesize.js'
import datetimestring from '../utils/datetimestring.js';
import VFSortIcon from './SortIcon.vue';
import VFToast from './Toast.vue';
import {getImageUrl} from '../utils/getImageUrl.js';
import LazyLoad from 'vanilla-lazyload';
import {useWalletsStore} from "~/store/wallet";
import {storeToRefs} from "pinia";
import {formatFilename} from "~/utils/formatFilename";

const props = defineProps({
  view: String,
  data: Object,
  search: Object
});

const store = useWalletsStore();
const { getCurrentWalletId, uploadingFiles } = storeToRefs(store)
const emitter = inject('emitter');
const { setStore, getStore } = inject('storage');
const adapter = inject('adapter');
const ext = (item) => item?.substring(0, 3)
const title_shorten = (title) => title.replace(/((?=([\w\W]{0,10}))([\w\W]{8,})([\w\W]{8,}))/, '$2..$4');
const selectorArea = ref(null);
const dragImage = ref(null);
const selectedCount = ref(0)
const ds = ref(null);
const {t} = inject('i18n');
const randId = Math.floor(Math.random() * 2**32);
const fullScreen = ref(getStore('full-screen', false));
const isMoveEnabled = ref(false);
const showFileInfo = ref(false);

const vfLazyLoad = new LazyLoad();

emitter.on('vf-fullscreen-toggle', () => {
  selectorArea.value.style.height = null;
  fullScreen.value = !fullScreen.value;
  setStore('full-screen', fullScreen.value);
});

const searchQuery = ref('');

emitter.on('vf-search-query', ({newQuery}) => {
  searchQuery.value = newQuery;

  if (newQuery) {
    emitter.emit('vf-fetch', {
      params: {
        q: 'search',
        adapter: props.data.adapter,
        path: props.data.dirname,
        filter: newQuery
      },
      onSuccess: (data) => {
        if (!data.files.length) {
          emitter.emit('vf-toast-push', {label: t('No search result found.')});
        }
      }
    });
  } else {
    emitter.emit('vf-fetch', {params:{q: 'index', adapter: props.data.adapter, path: props.data.dirname}});
  }
});

let touchTimeOut = null;

const clearTimeOut = () => {
  if (touchTimeOut) {
    clearTimeout(touchTimeOut);
  }
}

// on ios devices scrollbars are hidden as system level.
// to be able to scroll, 2 finger tap needed.
// this is the easiest way that I can think of.
const dragAndDrop = ref(true);
const handleTouchStart = (event) => {
  if (event.touches.length > 1) {
    if (!dragAndDrop.value) {
      ds.value.start();
      emitter.emit('vf-toast-push', {label: t('Drag&Drop: on')});
      emitter.emit('vf-explorer-update');
    } else {
      ds.value.stop();
      emitter.emit('vf-toast-push', {label: t('Drag&Drop: off')});
    }
    dragAndDrop.value = !dragAndDrop.value;
  }
};

const delayedOpenItem = ($event) => {
  touchTimeOut = setTimeout(() =>  {
    const cmEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: false,
        view: window,
        button: 2,
        buttons: 0,
        clientX: $event.target.getBoundingClientRect().x,
        clientY: $event.target.getBoundingClientRect().y
    });
    $event.target.dispatchEvent(cmEvent);

  } ,500)
}

const openItem = (item) => {
  if (item.type == 'dir') {
    emitter.emit('vf-search-exit');
    emitter.emit('vf-fetch', {params:{q: 'index', adapter: props.data.adapter, path:item.path}});
  } else {
    // emitter.emit('vf-modal-show', {type: 'preview', adapter: props.data.adapter, item});
  }
};

const sort = reactive( { active: false, column: '', order: '' });

const getItems = (sorted = true) => {
  let files = [...props.data.files],
      column = sort.column,
      order = sort.order == 'asc' ? 1 : -1;

  console.log(files)

  if (!sorted) {
    return files;
  }

  const compare = (a, b) => {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  if (sort.active) {
    files = files.slice().sort((a, b) => compare(a[column], b[column]) * order);
  }
  return files;
};

const sortBy = (column) => {
  if (sort.active && sort.column == column) {
    sort.active =  sort.order == 'asc'
    sort.column = column
    sort.order = 'desc'
  } else {
    sort.active =  true
    sort.column = column
    sort.order = 'asc'
  }
};

const getSelectedItems = () => ds.value ? ds.value.getSelection().map((el) => JSON.parse(el.dataset.item)) : [];

const handleDragStart = (e, item) => {
  if (e.altKey || e.ctrlKey || e.metaKey) {
    e.preventDefault();
    return false;
  }

  if (isMoveEnabled.value) {
    e.dataTransfer.setDragImage(dragImage.value, 0, 15);
    e.dataTransfer.effectAllowed = 'all';
    e.dataTransfer.dropEffect = 'copy';
    e.dataTransfer.setData('items', JSON.stringify(getSelectedItems()))
  } else {
    e.dataTransfer.dropEffect = 'none';
    e.dataTransfer.effectAllowed = 'none';
  }
};

const handleDropZone = (e, item) => {
  e.preventDefault();
  let draggedItems = JSON.parse(e.dataTransfer.getData('items'));

  if (draggedItems.find(item => item.storage != adapter.value)) {
    alert('Moving items between different storages is not supported yet.');
    return;
  }

  emitter.emit('vf-modal-show', {type:'move', items: {from: draggedItems, to: item}});
};

const handleDragOver = (e, item) => {
  e.preventDefault();
  if (!item || item.type !== 'dir' || ds.value.getSelection().find(el => el == e.currentTarget)) {
    e.dataTransfer.dropEffect = 'none';
    e.dataTransfer.effectAllowed = 'none';
  } else if (isMoveEnabled.value) {
    e.dataTransfer.dropEffect = 'copy';
  }
};

const handleMouseEnter = (e, item) => {
  if (e.altKey || e.ctrlKey || e.metaKey) {
    e.preventDefault();
    return false;
  }

  item.hover = true;

};

const setSelectedIcon = (item) => {
  if (getSelectedItems().find(selectedItem => selectedItem.path === item.path)) {
    item.selected = true;
  }
};

const handleMouseLeave = (e, item) => {
  if (e.altKey || e.ctrlKey || e.metaKey) {
    e.preventDefault();
    return false;
  }

  item.hover = false;
};

const setDragSelect = () => {
  ds.value = new DragSelect({
    area: selectorArea.value,
    keyboardDrag: false,
    selectedClass: 'vf-explorer-selected',
    selectorClass: 'vf-explorer-selector',
  });

  emitter.on('vf-explorer-update', () => nextTick(() => {
    ds.value.clearSelection();
    ds.value.setSettings({ selectables: document.getElementsByClassName('vf-item-' + randId ) });
  }));

  ds.value.subscribe('predragstart', ({event, isDragging}) => {
    // apply custom drag event
    if (isDragging) {
      selectedCount.value = ds.value.getSelection().length
      ds.value.break();
    } else {
      // if resizing selectable area at the corner dont start selection.
      const offsetX = event.target.offsetWidth - event.offsetX;
      const offsetY = event.target.offsetHeight - event.offsetY;
      if (offsetX < 15 && offsetY < 15) {
        ds.value.clearSelection();
        ds.value.break();
      }
    }
  });

  ds.value.subscribe('predragmove', ({isDragging}) => {
    if (isDragging) {
      ds.value.break();
    }
  });

  ds.value.subscribe("callback", (	{ items, event, isDragging}) => {
    emitter.emit('vf-nodes-selected', getSelectedItems());
    selectedCount.value = ds.value.getSelection().length;

    if (selectedCount.value === 1 && getSelectedItems()[0].type === 'file') {
      showFileInfo.value = true;
    } else {
      showFileInfo.value = false;
    }

    getItems().map((item) => {
      if (getSelectedItems().find(selectedItem => selectedItem.path === item.path)) {
        item.selected = true;
      } else {
        item.selected = false
      }
    });
  })
};

const hideFileInfo = () => {
  ds.value.clearSelection(true);
};

const getSelectedItemFilename = () => {
  if (getSelectedItems().length === 1) {
    return getSelectedItems()[0].basename;
  } else {
    return '';
  }
};

const getSelectedItemPath = () => {
  if (getSelectedItems().length === 1) {
    return formatFilename(getSelectedItems()[0].path.replace('local://', '').replace(getCurrentWalletId.value, ''), 200);
  } else {
    return '';
  }
};

const getSelectedItemSize = () => {
  if (getSelectedItems().length === 1) {
    return filesize(getSelectedItems()[0].file_size);
  } else {
    return '';
  }
};

const getSelectedItemHealth = () => {
  if (getSelectedItems().length === 1) {
    return getSelectedItems()[0].health > 0.5 ? 'Good' : 'Bad';
  } else {
    return '';
  }
};

emitter.on('vf-fetch', ({params, onSuccess = null, onError = null}) => {
  if (params.q === 'index' && params.hasOwnProperty('gotoFolder')) {
    hideFileInfo();
  }
})

onMounted(setDragSelect)

onUpdated(() => {
  ds.value.Area.reset();
  ds.value.SelectorArea.updatePos();
  vfLazyLoad.update();
})

onMounted(() => {
  watch(() => props.view, () => emitter.emit('vf-explorer-update'));
});

</script>

<style scoped>
.vf-item-spinner {
  position: absolute;
  left: calc(50% - 11px);
  top: calc(50% - 9px);
}
.vf-item-spinner-small {
  position: absolute;
  left: calc(50% - 7px);
  top: calc(50% - 7px);
}
.vf-item-caption {
  font-size: 13px;
  line-height: 18px;
  font-family: Roboto;
  font-weight: 400;
}
</style>

<template>
  <v-f-modal-layout>
    <div >

      <div class="w-full h-[72px] px-4 py-[5px] bg-zinc-800 rounded-tl-[28px] rounded-tr-[28px] justify-start items-center gap-1 inline-flex" style="border-bottom: 1px #938F99 solid">
        <div class="grow shrink basis-0 flex-col justify-center items-start inline-flex">
          <div class="h-6 py-2.5 justify-start items-center gap-px inline-flex">
            <div class="text-zinc-200 text-base font-normal font-['Roboto'] leading-normal tracking-wide">Upload files</div>
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
            <div class="mt-2" v-for="file in queue">

              <div :id="file.id" class="w-[475px] h-11 relative">
                <div class="w-[470px] h-11 pl-[414px] pr-3 left-0 top-0 absolute bg-zinc-600 rounded-xl justify-end items-center inline-flex">
                  <div @click.prevent="removeFile(file.id)" class="w-11 self-stretch px-3.5 py-[13px] justify-center items-center inline-flex cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                      <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM13 3H3V16H13V3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z" fill="#F2B8B5"/>
                    </svg>
                  </div>
                </div>
                <div class="left-[12px] top-[8px] absolute justify-start items-center gap-2 inline-flex">
                  <div class="w-6 h-6 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <mask id="mask0_86_7521" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                        <rect width="24" height="24" fill="#D9D9D9"/>
                      </mask>
                      <g mask="url(#mask0_86_7521)">
                        <path d="M7 17H14V15H7V17ZM7 13H17V11H7V13ZM7 9H17V7H7V9ZM5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM5 19H19V5H5V19Z" fill="#BEA9EE"/>
                      </g>
                    </svg>
                  </div>
                  <div class="h-7 justify-start items-start flex">
                    <div class="w-[326px] text-white text-sm font-normal font-['Roboto'] leading-7">{{ formatFilename(file.name, 20) }} ({{ file.size }}) <b>{{ humanFileStatus(file.status) }}</b></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="py-2" :style="queue.length ? ['position: absolute', 'left:-1000px;'] : ''">
              <div ref="pickFiles1"  class="w-[143px] h-10 bg-purple-300 rounded-[100px] flex-col justify-center items-center inline-flex cursor-pointer">
                <div class="self-stretch pl-4 pr-6 py-2.5 justify-center items-center gap-2 inline-flex">
                  <div class="w-[18px] h-[18px] relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M15 9.75H9.75V15H8.25V9.75H3V8.25H8.25V3H9.75V8.25H15V9.75Z" fill="#381E72"/>
                    </svg>
                  </div>
                  <div class="text-center text-violet-950 text-sm font-medium font-['Roboto'] leading-tight tracking-tight">Select Files</div>
                </div>
              </div>

            </div>
          </div>
          <div class="text-gray-500" ref="container">

          </div>
          <message v-if="message.length" @hidden="message=''" error>{{ message }}</message>
        </div>
      </div>
    </div>

    <template  v-slot:buttons>
      <div class="flex" :class="[!queue.length ? 'h-0' : 'py-3']">
        <div ref="pickFiles2" :class="[notEnoughFunds ? 'bg-rose-400' : 'bg-button1-100']" class="w-[143px] h-10 rounded-[100px] flex-col justify-center items-center inline-flex mr-4 cursor-pointer" >
          <div class="self-stretch pl-3 pr-4 py-2.5  bg-opacity-10 justify-center items-center gap-2 inline-flex">
            <div :class="[notEnoughFunds ? 'w-0' : 'w-[18px]']" class="h-[18px] relative">
              <svg v-if="!notEnoughFunds" xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                <path d="M15.5 9.75H10.25V15H8.75V9.75H3.5V8.25H8.75V3H10.25V8.25H15.5V9.75Z" fill="#D0BCFF"/>
              </svg>
            </div>
            <div :class="[notEnoughFunds ? 'text-black' : 'text-purple-300']" class="text-center text-sm font-medium font-['Roboto'] leading-tight tracking-tight">
              <span v-if="!notEnoughFunds">Select More</span>
              <span v-else>Not Enough Funds</span>
            </div>
          </div>
        </div>


        <div @click.prevent="handleUpload"
            class="w-[143px] h-10 bg-purple-300 rounded-[100px] flex-col justify-center items-center inline-flex cursor-pointer">
          <div class="pl-5 pr-7 py-2.5 justify-start items-center gap-2 inline-flex">
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
            <div class="text-center text-violet-950 text-sm font-medium font-['Roboto'] leading-tight tracking-tight">
              <span v-if="!isDownloading">{{ t('Upload') }}</span>
              <div v-else role="status">
                <svg aria-hidden="true" class="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
              </div>

            </div>
          </div>
        </div>


      </div>
    </template>
  </v-f-modal-layout>
</template>

<script>
export default {
  name: 'VFModalUpload'
};
</script>


<script setup>
import plupload from 'plupload'
import VFModalLayout from './ModalLayout.vue';
import {inject, onMounted, ref, watch} from 'vue';
import {useApiUrl} from '../../composables/useApiUrl.js';
import {CONFIG} from "~/env";
import {userStorage, useUserStore} from "~/store/user";
import getCurrentDir from "~/utils/getCurrentDir";
import {storeToRefs} from "pinia";
//import { onMessage, sendMessage } from "webext-bridge/popup";
import {CHUNK_SIZE} from "~/hat-sh-config/constants";
import {encodeArrayBufferToUrlSafeBase64} from "~/utils/base64";
import {formatFilename} from "~/utils/formatFilename";
import {subscriptionUsageEvent} from "~/services/backend";

const onMessage = () => {};
const sendMessage = () => {};

const userStore = useUserStore();
const { loadUsage, loadSubscriptions } = userStore;
const { user, userUsage, activeSubscription } = storeToRefs(userStore)
const emitter = inject('emitter');
const {apiUrl} = useApiUrl();
const {t} = inject('i18n');
const maxFileSize = inject('maxFileSize');

const props = defineProps({
  current: Object,
  currentWalletId: String
});

const uploader = ref(null);
const container = ref(null);
const pickFiles1 = ref(null);
const pickFiles2 = ref(null);
const queue = ref([]);
const message = ref('');
const notEnoughFunds = ref(false);

const files = ref([]);
const currFile = ref(0);
const isDownloading = ref(false);
let file,
    password,
    index,
    numberOfFiles,
    encryptionMethodState = "secretKey",
    privateKey,
    publicKey;

const disableUploadButton = ref(true);

const handleUpload = () => {
  if (notEnoughFunds.value) return;
  message.value = '';
  //TODO: remove plupload which was needed for uploading files without encryption
  // uploader.value.start();
  handleEncryptedFilesDownload();
};

const postData = inject('postData');

onMounted(() => {
  loadUsage(props.currentWalletId)

  uploader.value = new plupload.Uploader({
    runtimes: 'html5',
    browse_button: [pickFiles1.value, pickFiles2.value],
    container: container.value,
    max_file_size: maxFileSize,
    multiple_queues: true,
    file_data_name: 'file',
    http_method: 'PUT',
    url: `${CONFIG.API_HOST}/api/objects/`,//apiUrl.value + '?' + buildURLQuery(Object.assign(postData, {q: 'upload', adapter: props.current.adapter, path: props.current.dirname})),
    // filters : [
    // 	{title : "Image files", extensions : "jpg,gif,png,jpeg"},
    // 	{title : "Zip files", extensions : "zip"}
    // ],
    headers: {
      // ...(csrf && {'X-CSRF-Token' : csrf})
      ...{'Authorization': `Basic ${userStorage.get()?.token}`}
    },

    init: {
      PostInit: function () {
      },

      FilesAdded: function (up, selectedFiles) {
        console.log('userUsage', userUsage.value)

        let totalFileSize = 0;
        disableUploadButton.value = false;
        plupload.each(selectedFiles, function (file) {
          queue.value.push({
            id: file.id,
            name: file.name,
            size: plupload.formatSize(file.size),
            status: '',
          });
          totalFileSize += file.size;
        });

        selectedFiles = Array.from(selectedFiles);
        if (files.value.length > 0) {
          files.value = files.value.concat(selectedFiles);
          files.value = files.value.filter(
              (thing, index, self) =>
                  index ===
                  self.findIndex((t) => t.name === thing.name && t.size === thing.size)
          );
        } else {
          files.value = selectedFiles;
        }

        notEnoughFunds.value = false;
        const planCode = activeSubscription.value.plan_code;
        console.log('planCode', planCode)
        if (!planCode || ((planCode.startsWith('TRIAL')
                && totalFileSize + parseInt(userUsage.value.customer_usage.charges_usage[0].units) > parseFloat(CONFIG.TRIAL_PLAN_LIMIT) * 1024 * 1024) ||
            (planCode.startsWith('MEDIUM')
                && totalFileSize + parseInt(userUsage.value.customer_usage.charges_usage[0].units) > parseFloat(CONFIG.MEDIUM_PLAN_LIMIT) * 1024 * 1024) ||
            (planCode.startsWith('LARGE')
                && totalFileSize + parseInt(userUsage.value.customer_usage.charges_usage[0].units) > parseFloat(CONFIG.LARGE_PLAN_LIMIT) * 1024 * 1024))
        ) {
          notEnoughFunds.value = true;
        }

      },

      BeforeUpload: function (up, file) {
        const currentDir = getCurrentDir(props.currentWalletId, props.current.dirname);
        up.setOption('url', `${CONFIG.API_HOST}/api/objects/` + props.currentWalletId + '?pathType=file' + '&path=' + currentDir + encodeURIComponent(file.name));
      },

      UploadProgress: function (up, file) {
        queue.value[queue.value.findIndex((item) => item.id == file.id)].percent = file.percent + '%';
      },

      UploadComplete: function () {
        disableUploadButton.value = true;
        emitter.emit('vf-fetch', {params:{q: 'index', adapter: props.current.adapter, path: props.current.dirname}});
      },

      Error: function (up, err) {

        uploader.value.stop();
        if (err.code == plupload.HTTP_ERROR) {
          message.value = t(JSON.parse(err.response).message);
        } else if (err.code == plupload.FILE_SIZE_ERROR) {
          message.value = t('The selected file exceeds the maximum file size. You cannot upload files greater than %s', [maxFileSize]);
        } else {
          message.value = t(err.message);
        }
      }
    }
  });

  uploader.value.init();
});

// See https://github.com/sh-dv/hat.sh/blob/master/src/components/EncryptionPanel.js
onMessage('hat-sh-response', async (message) => {
  const {data, sender} = message;

  if (!Array.isArray(data)) {
    console.error('unexpected data', data);
  }

  const action = data[0];

  let params = [], idx;

  if (data.length > 1)
    params = data.slice(1);

  switch (action) {
    case 'keysGenerated':
      startEncryption("secretKey");
      break;

    case "keyPairReady":
      startEncryption("publicKey");
      break;

    case "filePreparedEnc":
      console.log("filePreparedEnc")
      kickOffEncryption();
      break;

    case "continueEncryption":
      continueEncryption();
      break;

    case "encryptionFinished":
      idx = queue.value.findIndex((item) => item.id === params[0])
      if (idx !== -1) {
        queue.value[idx].status = 'encrypted';

        if (numberOfFiles > 1) {
          updateCurrFile();
          file = null;
          index = null;
          if (currFile.value <= numberOfFiles - 1) {
            setTimeout(function () {
              prepareFile();
            }, 1000);
          } else {
            // isDownloading.value = false;
            // handleNext();
          }
        } else {
          // isDownloading.value = false;
          // handleNext();
        }
      }
      break;
    case "uploadingFinished":
      console.log('uploadingFinished (modalUpload)')
      idx = queue.value.findIndex((item) => item.id === params[0]);
      if (idx !== -1) {
        queue.value[idx].status = 'uploaded';

        let totalUploaded = queue.value.reduce((count, item) => {
          if (item.status === 'uploaded') {
            return count + 1;
          }
          return count;
        }, 0);

        if (totalUploaded === numberOfFiles) {
          isDownloading.value = false;
          disableUploadButton.value = true;
          emitter.emit('vf-fetch', {params: {q: 'index', adapter: props.current.adapter, path: props.current.dirname, closeModal: true}});
        }
      }
      setTimeout(()=> {
        loadUsage(props.currentWalletId)
        loadSubscriptions(props.currentWalletId)
      }, 3000)

      break;
    case "limitExceeded":
    case "uploadError":
      emitter.emit('vf-modal-close');
      emitter.emit('vf-toast-push', {label: params[1]});

      const queueIdx = queue.value.findIndex((item) => item.id === params[0]);
      if (queueIdx !== -1) {
        const currentDir = getCurrentDir(props.currentWalletId, props.current.dirname);

        emitter.emit('vf-fetch', {
          params:
              {
                q: 'index',
                adapter: props.current.adapter,
                path: props.current.dirname,
                uploadingWalletId: props.currentWalletId,
                uploadingCurrentDir: currentDir,
                uploadingFilename: queue.value[queueIdx].name,
                status: action
              }
        });

        queue.value.splice(queueIdx, 1);
      }
      break;
  }
});

const updateCurrFile = () => {
  currFile.value += 1;
};

const handleEncryptedFilesDownload = async () => {
  numberOfFiles = files.value.length;
  prepareFile();
};

const prepareFile = async () => {
  // send file name to sw
  let fileName = encodeURIComponent(files.value[currFile.value].name + ".enc");
  console.trace("prepareFile")
  await sendMessage('hat-sh', [ "prepareFileNameEnc", fileName ], 'background');
};

const startEncryption = (method) => {
  // file is plupload object, to get native file use file.getSource()
  file.getSource()
      .slice(0, CHUNK_SIZE).getSource()
      .arrayBuffer()
      .then(async (chunk) => {
        index = CHUNK_SIZE;

        const chunkString = encodeArrayBufferToUrlSafeBase64(chunk);

        if (method === "secretKey") {
          await sendMessage('hat-sh', [ "encryptFirstChunk", chunkString, index >= file.size, file.id ], 'background');
        }
        if (method === "publicKey") {
          await sendMessage('hat-sh', [ "asymmetricEncryptFirstChunk", chunkString, index >= file.size, file.id ], 'background');
        }
      });

};

const kickOffEncryption = async () => {
  if (currFile.value <= numberOfFiles - 1) {
    file = files.value[currFile.value];

    queue.value[queue.value.findIndex((item) => item.id === file.id)].status = 'encrypting';

    // window.open(`file`, "_self");
    const currentDir = getCurrentDir(props.currentWalletId, props.current.dirname);

    emitter.emit('vf-fetch', {params:
          {
            q: 'index',
            adapter: props.current.adapter,
            path: props.current.dirname,
            uploadingWalletId: props.currentWalletId,
            uploadingCurrentDir: currentDir,
            uploadingFilename: file.name,
            status: 'uploading'
          }
    });

    await sendMessage('hat-sh', [ "doStreamFetch",
      `${CONFIG.API_HOST}/api/objects/` + props.currentWalletId + '?pathType=file' + '&path=' + currentDir + encodeURIComponent(file.name),
      user?.value.token, file.id
    ], 'background');

    isDownloading.value = true;

    if (encryptionMethodState === "publicKey") {

      let mode = "derive";

      await sendMessage('hat-sh', [ "requestEncKeyPair", privateKey, publicKey, mode ], 'background');
    }

    if (encryptionMethodState === "secretKey") {
      await sendMessage('hat-sh', [ "requestEncryption", JSON.stringify(user?.value.unlockPassword) ], 'background');
    }
  } else {
    // console.log("out of files")
  }
};

const continueEncryption = (e) => {
  // file is plupload object, to get native file use file.getSource()
  file.getSource()
      .slice(index, index + CHUNK_SIZE).getSource()
      .arrayBuffer()
      .then(async (chunk) => {
        index += CHUNK_SIZE;

        console.log("chunk " + index, chunk)
        const chunkString = encodeArrayBufferToUrlSafeBase64(chunk);

        await sendMessage('hat-sh', [ "encryptRestOfChunks", chunkString, index >= file.size, file.id ], 'background');
      });
};

const humanFileStatus = (status) => {
  if (status === 'encrypting') return 'Encrypting';
  if (status === 'encrypted') return 'Encrypted. Uploading...';
  if (status === 'uploaded') return 'Uploaded';
}

const removeFile = (fileId) => {
  const idx = queue.value.findIndex((item) => item.id === fileId);
  if (idx !== -1) {
    queue.value.splice(idx, 1);
    files.value.splice(idx, 1);
  }
}




</script>

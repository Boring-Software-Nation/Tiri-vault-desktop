<template>
  <div class="vuefinder h-full">
    <div :class="darkMode ? 'dark': ''" class="h-full">
      <div
          :class="fullScreen ? 'fixed w-screen inset-0 z-20' : 'relative rounded-md'"
          :style="!fullScreen ? 'max-height: ' + maxHeight : ''"
          class="h-full border flex flex-col bg-white dark:bg-zinc-900 text-gray-700 dark:text-neutral-200 border-neutral-300 dark:border-gray-900 min-w-min select-none"
          @mousedown="emitter.emit('vf-contextmenu-hide')" @touchstart="emitter.emit('vf-contextmenu-hide')">
        <v-f-toolbar :data="fetchData" />
        <v-f-breadcrumb :data="fetchData" :currentWalletId="getCurrentWalletId"/>
        <v-f-explorer :view="view" :data="fetchData"/>
        <v-f-statusbar :data="fetchData"/>
      </div>

      <component v-if="modal.active" :is="'v-f-modal-'+ modal.type" :selection="modal.data" :current="fetchData" :currentWalletId="getCurrentWalletId"/>
      <v-f-context-menu :current="fetchData"/>
      <iframe id="download_frame" style="display:none;"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueFinder'
};
</script>

<script setup>
import {computed, inject, onMounted, provide, reactive, ref, watch, watchEffect} from 'vue';
import ajax from '../utils/ajax.js';
import {useStorage} from '../composables/useStorage.js';
import {useApiUrl} from '../composables/useApiUrl.js';
import VFToolbar from '../components/Toolbar.vue';
import VFExplorer from '../components/Explorer.vue';
import VFStatusbar from '../components/Statusbar.vue';
import VFBreadcrumb from '../components/Breadcrumb.vue';
import VFContextMenu from '../components/ContextMenu.vue';
import {useI18n} from '../composables/useI18n.js';
import {api, isFetchError} from "~/services";
import {CONFIG} from "~/env";
import getCurrentDir, {storageName} from "~/utils/getCurrentDir";
import {saveBlobToMachine} from "~/utils/saveBlobToMachine";
import {useWalletsStore} from "~/store/wallet";
import {storeToRefs} from "pinia";
import {useUserStore} from "~/store/user";
import {loginOrRegisterUser} from "~/services/backend";
//import { onMessage, sendMessage } from "webext-bridge/popup";
import { onMessage, sendMessage } from '~/hat-sh/';
import { CHUNK_SIZE, crypto_secretstream_xchacha20poly1305_ABYTES } from "~/hat-sh-config/constants";
import {encodeArrayBufferToUrlSafeBase64} from "~/utils/base64";
import {formatName} from "~/utils/formatName";

const store = useWalletsStore();
const { currentWallet, getCurrentWalletId } = storeToRefs(store)
const { getUploadingFiles, setUploadingFiles } = store;
const userStore = useUserStore();
const { loadUsage, loadSubscriptions } = userStore;
const { user } = storeToRefs(userStore)

const props = defineProps({
  url: {
    type: [String],
  },
  id: {
    type: String,
    default: 'vf'
  },
  dark: {
    type: Boolean,
    default: false
  },
  usePropDarkMode: {
      type: Boolean,
      default: false
  },
  locale: {
      type: String,
      default: 'en'
  },
  maxHeight: {
    type: String,
    default: '600px'
  },
  maxFileSize: {
    type: String,
    default: '2000mb'
  },
  postData: {
    type: Object,
    default: {}
  }
});

const {setStore, getStore} = useStorage(props.id);
const adapter =ref(getStore('adapter'));

const emitter = inject('emitter');

provide('storage', useStorage(props.id));
provide('postData', props.postData);
provide('adapter', adapter);
provide('maxFileSize', props.maxFileSize);
provide('usePropDarkMode', props.usePropDarkMode);

// Decryption
let file,
    index,
    decFileBuff,
    files = [],
    currFile = 0,
    numberOfFiles,
    privateKey,
    publicKey;

const badFile = ref(false), isCheckingFile = ref(false), fileMixUp = ref(false), decryptionMethod = ref(''), decryptionMethodState = ref(''),
      currFileState = ref(0), wrongPassword = ref(false), wrongPrivateKey = ref(false), wrongPublicKey = ref(false),
      keysError = ref(false), keysErrorMessage = ref(''), isTestingKeys = ref(false), isTestingPassword = ref(false),
      isDownloading = ref(false);

// Lang Management
const i18n = useI18n(props.id, props.locale, emitter);
const {t} = i18n;
provide('i18n', i18n);

const {apiUrl, setApiUrl} = useApiUrl();
setApiUrl(props.url);

const fetchData = reactive({adapter: adapter.value, storages: [], dirname: '.', files: []});

// View Management
const view = ref(getStore('viewport', 'grid'));
const darkMode = props.usePropDarkMode ? computed(() => props.dark) : ref(getStore('darkMode', props.dark));

emitter.on('vf-darkMode-toggle', () => {
  darkMode.value = !darkMode.value;
  setStore('darkMode', darkMode.value);
});

const loadingState = ref(false);

provide('loadingState', loadingState);

const fullScreen = ref(getStore('full-screen', false));

emitter.on('vf-fullscreen-toggle', () => {
  fullScreen.value = !fullScreen.value;
  setStore('full-screen', fullScreen.value);
});

emitter.on('vf-view-toggle', (newView) => {
  view.value = newView;
});

// Modal Management
const modal = reactive({
  active: false,
  type: 'delete',
  data: {}
});

emitter.on('vf-modal-close', () => {
  modal.active = false;
});

emitter.on('vf-modal-show', (item) => {
  modal.active = true;
  modal.type = item.type;
  modal.data = item;
});

const updateItems = (data) => {
  Object.assign(fetchData, data);
  emitter.emit('vf-nodes-selected', {});
  emitter.emit('vf-explorer-update');
};

let controller;
emitter.on('vf-fetch-abort', () => {
  controller.abort();
  loadingState.value = false;
});

onMounted(async () => {
  loadUsage(getCurrentWalletId.value);
  loadSubscriptions(getCurrentWalletId.value);
})




const getObjects = async (path, isSearch = false, params = {}) => {
  const currentDir = getCurrentDir(getCurrentWalletId.value, path);
  const pathType = currentDir.endsWith('/') ? 'dir' : 'file';
  console.log('%cGet objects: ' + currentDir, 'background: #222; color: #bada55')
  let data = { entries: [] };
  if (isSearch) {
    data.entries = await api.search.objectsList({key: params.key}).then(res => res.data);
  } else {
    data = await api.objects.objectsDetail(getCurrentWalletId.value, {
      ...params,
      query: {
        pathType: pathType,
        path: currentDir
      }
    }).then(res => res.data);
  }
  console.log('%cdata: ', 'background: #222; color: #bada55', data)
  if (data.status === 404) {
    return data;
  }

  data.adapter = storageName;
  data.storages = [storageName];
  data.dirname = storageName + '://' + getCurrentWalletId.value + (!currentDir.startsWith('/') ? '/' : '') + currentDir;
  if (!data.entries) {
    data.entries = [];
  }
  data.files = data.entries.map((entry) => {
    const path = entry.name.replace(/\/$/, '').replace(/^\//g, '');
    const filename = path.split('/').pop();
    let extension = '';
    if (entry.name.endsWith('/')) {
      entry.type = 'dir';
    } else {
      entry.type = 'file';
      extension = name.split('.').pop();
      entry.mime_type = '';
    }
    entry.basename = filename;
    entry.path = storageName + '://' + path;
    entry.visible_path = entry.path.replace(storageName + '://', '').replace(getCurrentWalletId.value, '');
    entry.extension = extension;
    entry.file_size = entry.size;
    entry.visibility = 'public'
    entry.last_modified = '';
    entry.extra_metadata = [];
    entry.storage = storageName;
    entry.status = ''

    delete entry.name;
    delete entry.size;

    return entry;
  });
  delete data.entries;

  data.files.sort((a, b) => {
    // Compare the "type" property of objects a and b
    const typeA = a.type;
    const typeB = b.type;

    if (typeA === "dir" && typeB !== "dir") {
      return -1; // Directories should come before files
    } else if (typeA !== "dir" && typeB === "dir") {
      return 1; // Files should come after directories
    } else {
      // If both have the same type or if neither is a directory, maintain the original order
      return 0;
    }
  });

  console.log(data)
  return data;
};

watchEffect(async () => {
  if (!currentWallet.value)
    return;

  if (user?.value.token) {
    const r = await getObjects('/');
    if (r.files.length === 0) {
      await createFolder('', '');
    }
    emitter.emit('vf-fetch', {params: {q: 'index', path:'/', adapter: (adapter.value)}});
  } else {
    await loginOrRegisterUser(getCurrentWalletId.value, user?.value.unlockPassword);
  }

})

watch(decryptionMethodState, (val) => {if (val) prepareFile();});

const createFolder = async (path, name) => {
  const currentDir = getCurrentDir(getCurrentWalletId.value, path);
  path = currentDir + name
  if (!currentDir.endsWith('/')) {
    path += '/'
  }

  const data = await api.objects.objectsUpdate(getCurrentWalletId.value, null, {query: {pathType: 'dir', path: path}} ).then(res => res.data);
  return data;
};

emitter.on('vf-fetch', ({params, onSuccess = null, onError = null}) => {
  if (['index', 'search'].includes(params.q)) {
    if (controller) {
      controller.abort();
    }
    loadingState.value = true;
  }

  controller = new AbortController();
  const signal = controller.signal;


  const deleteObjects = async (path, items) => {
    const currentDir  = getCurrentDir(getCurrentWalletId.value, path);

    const deletionPromises = items.map(async item => {
      let itemPath = item.path.replace(storageName + '://' + getCurrentWalletId.value + '/', '');
      itemPath += (item.type === 'dir' && !itemPath.endsWith('/') ? '/' : '')
      const result = await api.objects.objectsDelete2(getCurrentWalletId.value, {query: {pathType: item.type, path: itemPath}})
      return result.data;
    });

    try {
      const deletedData = await Promise.all(deletionPromises);
      return deletedData;
    } catch (error) {
      throw error;
    }
  };


  if (params.q === 'newfolder') {
    const data = createFolder(params.path, params.name).then(data => {
      if (onSuccess) {
        onSuccess(data);
        emitter.emit('vf-modal-close');
        emitter.emit('vf-fetch', {params:{q: 'index', adapter: adapter, path: params.path}});
      }
    })
    .catch((e) => {
      if (onError) {
        onError(e.error);
      }
    })
  } else if (params.q === 'delete') {
    const data = deleteObjects(params.path, params.items).then(data => {
      if (onSuccess) {
        onSuccess(data);
        emitter.emit('vf-modal-close');
        emitter.emit('vf-fetch', {params:{q: 'index', adapter: adapter, path: params.path}});

        setTimeout(() => {
          loadUsage(getCurrentWalletId.value);
        }, 3000);
      }
    })
    .catch((e) => {
      if (onError) {
        onError(e.error);
      }
    })
  } else if (params.q === 'index' || params.q === 'search') {
    getObjects(params.path, params.q === 'search', { signal, key: params.filter }).then(data => {
      adapter.value = data.adapter;
      if (['index', 'search'].includes(params.q)) {
        loadingState.value = false;
      }
      const uploadingFiles = getUploadingFiles() || [];
      let path;
      if (params.hasOwnProperty('closeModal')) {
        emitter.emit('vf-modal-close');
      } else {
        let uploadingCurrentDir = params.uploadingCurrentDir;
        if (uploadingCurrentDir !== undefined) {
          if (!uploadingCurrentDir.startsWith('/')) {
            uploadingCurrentDir = '/' + uploadingCurrentDir;
          }
          if (!uploadingCurrentDir.endsWith('/')) {
            uploadingCurrentDir = uploadingCurrentDir + '/';
          }
          path = 'local://' + params.uploadingWalletId + uploadingCurrentDir + params.uploadingFilename;
          if (!data.files.find(file => file.path === path) && !uploadingFiles.find(file => file.path === path)) {
            uploadingFiles.push({
              basename: params.uploadingFilename,
              path: path,
              type: 'file',
              visibility: 'public',
              storage: storageName,
              file_size: 0,
              last_modified: '',
              extra_metadata: [],
              extension: '',
              mime_type: '',
              status: 'uploading',
            })
          }
        }
      }
      for (let i=0; i < data.files.length; i++) {
        const idx = uploadingFiles.findIndex(file => file.path === data.files[i].path);
        if (idx !== -1) {
          uploadingFiles.splice(idx, 1);
        }
      }
      const idx = uploadingFiles.findIndex(file => file.path === path && (params.status === 'limitExceeded' || params.status === 'uploadError'));
      if (idx !== -1) {
        uploadingFiles.splice(idx, 1);
      }

      setUploadingFiles(uploadingFiles);
      data.files.push(...uploadingFiles);

      console.log(data)
      updateItems(data);
      if (onSuccess) {
        onSuccess(data);
      }
    })
    .catch((e) => {
      if (onError) {
        onError(e.error);
      }
    })
    .finally(() => {
    });
  }


  // ajax(apiUrl.value, {params, signal})
  //     .then(data => {
  //       adapter.value = data.adapter;
  //       if (['index', 'search'].includes(params.q)) {
  //         loadingState.value = false;
  //       }
  //       emitter.emit('vf-modal-close');
  //       updateItems(data);
  //       onSuccess(data);
  //     })
  //     .catch((e) => {
  //       if (onError) {
  //         onError(e);
  //       }
  //     })
  //     .finally(() => {
  //     });
});

emitter.on('vf-download', async (params) => {
  // document.getElementById('download_frame').src = url;

  const downloadObject = async (path) => {
    const response = await api.objects.objectsDetail(
        getCurrentWalletId.value,
        { query: { pathType: 'file',
            path: path.replace(storageName + '://', '').replace(getCurrentWalletId.value + '/', ''),
            serviceName: 'worker', format: 'blob' }, format: 'blob'}
    );
    return response.data;
  };

  const data = await downloadObject(params.path);
  console.log(data)
  if (data) {
    // saveBlobToMachine(params.path.split('/').pop(), data);

    resetFileErrors();
    files = [{
      name: params.path.split('/').pop(),
      blob: data,
      size: data.size
    }];
    handleEncryptedFilesDownload();
  }

  emitter.emit('vf-modal-close');
});

// See https://github.com/sh-dv/hat.sh/blob/master/src/components/EncryptionPanel.js

const handleEncryptedFilesDownload = async () => {
  numberOfFiles = files.length;
  checkFiles();
};

const prepareFile = async () => {
  console.log('prepareFile')
  // send file name to sw
  let fileName = encodeURIComponent(formatName(files[currFile].name));
  await sendMessage('hat-sh', [ "prepareFileNameDec", fileName, '-dec' ], 'background');
};

onMessage('hat-sh-response-dec', async (message) => {
  const {data, sender} = message;

  if (!Array.isArray(data)) {
    console.error('unexpected data', data, message);
    return;
  }

  const action = data[0];
  console.log('VueFinder - onMessage:', action, data);

  let params = [];

  if (data.length > 1)
    params = data.slice(1);

  switch (action) {
    case 'badFile':
      if (numberOfFiles > 1) {
        badFile.value = files[currFile].name;
        isCheckingFile.value = false;
      } else {
        badFile.value = true;
        isCheckingFile.value = true;
      }
      break;
    case "secretKeyEncryption":
      console.log('secretKeyEncryption received')
      if (numberOfFiles > 1) {
        if (
            decryptionMethodState.value &&
            decryptionMethodState.value !== "secretKey"
        ) {
          checkFileMixUp();
          return;
        } else {
          decryptionMethodState.value = "secretKey";
          decryptionMethod.value = "secretKey";
          checkFilesQueue();
        }
      } else {
        decryptionMethod.value = "secretKey";
        decryptionMethodState.value = "secretKey";
        // setActiveStep(1);
        isCheckingFile.value = false;
        resetCurrFile();
      }
      break;
    case "publicKeyEncryption":
      if (numberOfFiles > 1) {
        if (
            decryptionMethodState.value &&
            decryptionMethodState.value !== "publicKey"
        ) {
          checkFileMixUp();
          return;
        } else {
          decryptionMethodState.value = "publicKey";
          decryptionMethod.value = "publicKey";
          checkFilesQueue();
        }
      } else {
        decryptionMethodState.value = "publicKey";
        decryptionMethod.value = "publicKey";
        // setActiveStep(1);
        isCheckingFile.value = false;
        resetCurrFile();
      }
      break;
    case "wrongDecPrivateKey":
      wrongPrivateKey.value = true;
      isTestingKeys.value = false;
      break;

    case "wrongDecPublicKey":
      wrongPublicKey.value = true;
      isTestingKeys.value = false;
      break;

    case "wrongDecKeys":
      wrongPublicKey.value = true;
      wrongPrivateKey.value = true;
      isTestingKeys.value = false;
      break;

    case "wrongDecKeyPair":
      keysError.value = true;
      keysErrorMessage.value = 'This key pair is invalid! Please select keys for different parties.';
      isTestingKeys.value = false;
      break;

    case "wrongDecKeyInput":
      keysError.value = true;
      keysErrorMessage.value = 'Invalid keys input.';
      isTestingKeys.value = false;
      break;

    case "wrongPassword":
      console.log('wrongPassword')
      wrongPassword.value  = true;
      isTestingPassword.value = false;
      break;

    case "filePreparedDec":
      kickOffDecryption();
      break;

    case "readyToDecrypt":
      if (numberOfFiles > 1) {
        checkFilesTestQueue();
      } else {
        isTestingKeys.value = false;
        isTestingPassword.value = false;
        // handleNext();
        resetCurrFile();
      }
      break;

    case "decKeyPairGenerated":
      console.log('decKeyPairGenerated')
      startDecryption("publicKey");
      break;

    case "decKeysGenerated":
      console.log('decKeysGenerated')
      startDecryption("secretKey");
      break;

    case "continueDecryption":
      continueDecryption();
      break;

    case "decryptionFinished":
      if (numberOfFiles > 1) {
        updateCurrFile();
        file = null;
        index = null;
        if (currFile <= numberOfFiles - 1) {
          setTimeout(function () {
            prepareFile();
          }, 1000);
        } else {
          isDownloading.value = false;
          // handleNext();
        }
      } else {
        isDownloading.value = false;
        // handleNext();
      }
      break;
  }
});

const checkFileMixUp = () => {
  fileMixUp.value = true;
  isCheckingFile.value = false;
};

const checkFilesQueue = () => {
  if (numberOfFiles > 1) {
    updateCurrFile();

    if (currFile <= numberOfFiles - 1) {
      checkFiles();
    } else {
      // setActiveStep(1);
      isCheckingFile.value = false;
      resetCurrFile();
    }
  }
};

const resetCurrFile = () => {
  currFile = 0;
  currFileState.value = currFile;
};

const checkFiles = () => {
  numberOfFiles = files.length;
  if (currFile <= numberOfFiles - 1) {
    checkFile(files[currFile].blob);
  }
};

const checkFile = (file) => {

    isCheckingFile.value = true;
    badFile.value = false;
    fileMixUp.value = false;

    Promise.all([
      file.slice(0, 11).arrayBuffer(), //signatures
      file.slice(0, 22).arrayBuffer(), //v1 signature
    ]).then(async ([signature, legacy]) => {
      console.log('checkFile sent')
      await sendMessage('hat-sh', [ "checkFile",
        encodeArrayBufferToUrlSafeBase64(signature),
        encodeArrayBufferToUrlSafeBase64(legacy),
        '-dec'
      ], 'background');
    });
};

const kickOffDecryption = async (e) => {
  if (currFile <= numberOfFiles - 1) {
    file = files[currFile].blob;
    window.open(`file`, "_self");
    isDownloading.value = true;

    if (decryptionMethodState.value === "secretKey") {

        Promise.all([
          file.slice(0, 11).arrayBuffer(), //signature
          file.slice(11, 27).arrayBuffer(), //salt
          file.slice(27, 51).arrayBuffer(), //header
          file
              .slice(
                  51,
                  51 + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES
              )
              .arrayBuffer(), //17
        ]).then(async ([signature, salt, header, chunk]) => {
          // console.log('signature', signature, 'salt', salt, 'header', header, 'chunk', chunk)
          await sendMessage('hat-sh', [ "requestDecryption",
            JSON.stringify(user?.value.unlockPassword),
            encodeArrayBufferToUrlSafeBase64(signature),
            encodeArrayBufferToUrlSafeBase64(salt),
            encodeArrayBufferToUrlSafeBase64(header)
          ], 'background');
        });

    }

    if (decryptionMethodState.value === "publicKey") {

        let mode = "derive";

        Promise.all([
          file.slice(11, 35).arrayBuffer(), //header
          file
              .slice(
                  35,
                  35 + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES
              )
              .arrayBuffer(), //17
        ]).then(async ([header, chunk]) => {
          decFileBuff = chunk;
          await sendMessage('hat-sh', [ "requestDecKeyPair",
            privateKey,
            publicKey,
            encodeArrayBufferToUrlSafeBase64(header),
            encodeArrayBufferToUrlSafeBase64(decFileBuff),
            mode
          ], 'background');
        });

    }
  } else {
    // console.log("out of files")
  }
};

const checkFilesTestQueue = () => {
  if (numberOfFiles > 1) {
    updateCurrFile();

    if (currFile <= numberOfFiles - 1) {
      testFilesDecryption();
    } else {
      isTestingKeys.value = false;
      isTestingPassword.value = false;
      // handleNext();
      resetCurrFile();
    }
  }
};

const testFilesDecryption = () => {
  numberOfFiles = files.length;
  if (currFile <= numberOfFiles - 1) {
    testDecryption(files[currFile].blob);
  }
};

const testDecryption = (file) => {
  if (decryptionMethodState.value === "secretKey") {

      isTestingPassword.value  = true;
      wrongPassword.value = false;

      Promise.all([
        file.slice(0, 11).arrayBuffer(), //signature
        file.slice(11, 27).arrayBuffer(), //salt
        file.slice(27, 51).arrayBuffer(), //header
        file
            .slice(
                51,
                51 + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES
            )
            .arrayBuffer(), //17
      ]).then(async ([signature, salt, header, chunk]) => {
        decFileBuff = chunk; //for testing the dec password

        await sendMessage('hat-sh', [ "requestTestDecryption",
          JSON.stringify(user?.value.unlockPassword),
          encodeArrayBufferToUrlSafeBase64(signature),
          encodeArrayBufferToUrlSafeBase64(salt),
          encodeArrayBufferToUrlSafeBase64(header),
          encodeArrayBufferToUrlSafeBase64(decFileBuff)
        ], 'background');
      });

  }

  if (decryptionMethodState.value === "publicKey") {

      isTestingKeys.value = true;
      keysError.value = false;
      wrongPrivateKey.value = false;
      wrongPublicKey.value = false;

      let mode = "test";

      Promise.all([
        file.slice(11, 35).arrayBuffer(), //header
        file
            .slice(
                35,
                35 + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES
            )
            .arrayBuffer(), //17
      ]).then(async ([header, chunk]) => {
        decFileBuff = chunk;

        await sendMessage('hat-sh', [ "requestTestDecryption",
          privateKey,
          publicKey,
          encodeArrayBufferToUrlSafeBase64(header),
          encodeArrayBufferToUrlSafeBase64(decFileBuff),
          mode
        ], 'background');
      });

  }
};

const startDecryption = (method) => {
  let startIndex;
  if (method === "secretKey") startIndex = 51;
  if (method === "publicKey") startIndex = 35;

  file = files[currFile].blob;

  file
      .slice(
          startIndex,
          startIndex + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES
      )
      .arrayBuffer()
      .then(async (chunk) => {
        index =
            startIndex +
            CHUNK_SIZE +
            crypto_secretstream_xchacha20poly1305_ABYTES;

        // transfer chunk ArrayBuffer to service worker
        await sendMessage('hat-sh', [ "decryptFirstChunk",
          encodeArrayBufferToUrlSafeBase64(chunk),
          index >= file.size
        ], 'background');
      });

};

const continueDecryption = () => {
  file = files[currFile].blob;

  file
      .slice(
          index,
          index + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES
      )
      .arrayBuffer()
      .then(async (chunk) => {
        index += CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES;

        await sendMessage('hat-sh', [ "decryptRestOfChunks",
          encodeArrayBufferToUrlSafeBase64(chunk),
          index >= file.size
        ], 'background');
      });

};

const resetFileErrors = () => {
  badFile.value = false;
  fileMixUp.value = false;
  resetCurrFile();
  decryptionMethodState.value = null;
};

</script>

<script setup lang="ts">
import { CONFIG } from "~/env";
import { CHUNK_SIZE, crypto_secretstream_xchacha20poly1305_ABYTES } from "~/hat-sh-config/constants";
import { reactive, computed, onMounted, ref, watchEffect, unref, shallowRef, watch, onUnmounted} from "vue";
import { storeToRefs } from 'pinia';
import { userStorage, useUserStore } from '~/store/user';
import { useWalletsStore } from "~/store/wallet";
import { loginOrRegisterUser } from "~/services/backend";
import { decodeUrlSafeBase64ToArrayBuffer, encodeArrayBufferToUrlSafeBase64 } from "~/utils/base64";
import { FileDiffs, FileTreeModel, FileTreeNode, diffTrees, parseFileTreeModel } from "~/utils/filetreemodel";
import getCurrentDir, {storageName} from "~/utils/getCurrentDir";
import { api } from "@renderer/services";
import { onMessage as _onMessage, offMessage, sendMessage } from '~/hat-sh/';
import { Buffer } from 'buffer';
import { io, Socket } from 'socket.io-client';
import WalletDisplay from "~/components/wallet/WalletDisplay.vue";

const state = reactive({
  directory: '',
  directorySynced: false,
  messages: [] as string[],
});

const walletStore = useWalletsStore();
const { allWallets } = walletStore;
const { currentWallet, getCurrentWalletId } = storeToRefs(walletStore);
const userStore = useUserStore();
const { loadUsage, loadSubscriptions, userLogout } = userStore;
const { user, userUsage, activeSubscription } = storeToRefs(userStore);

const localTree = shallowRef<FileTreeModel>(null);
const remoteTree = shallowRef<FileTreeModel>(null);

const syncActive = ref(false);
const running = ref(false);
const stopping = ref(false);
const stoppedByLimits = ref(false);

type QuueItem = {
  id: number,
  file: FileTreeNode,
  fd?: number,
  status?: 'encrypting'|'encrypted'|'uploaded',
}

const queue = ref<QuueItem[]>([]);
const currFile = ref(0);
let numberOfFiles: number;
//const encryptionMethodState = "secretKey";
let privateKey: any, publicKey: any; // not used in current implementation

const ipcSend = (channel, ...args) => window.electron.ipcRenderer.send(channel, ...args);
const ipcCleanups = [] as (()=>void)[];
const ipcOn = (channel, listener) => ipcCleanups.push( window.electron.ipcRenderer.on(channel, listener) );

const messageHandlers = [] as ((message:any)=>void)[];
const onMessage = (action, handler) => messageHandlers.push( _onMessage(action, handler) );
const clearMessageHandlers = () => {
  messageHandlers.forEach((handler) => offMessage(handler));
  messageHandlers.splice(0, messageHandlers.length);
}

onMounted(() => {
  loadUsage(getCurrentWalletId.value)
  loadSubscriptions(getCurrentWalletId.value)
});

onUnmounted(async () => {
  //console.log('!!! onUnmounted !!!');
  if (running.value) {
    await stopSync(StopReason.OTHER);
  }
  stopWebsocketClient();
  state.messages = [];
  state.directory = '';
  //console.log('!!! cleanups !!!', ipcCleanups, messageHandlers);
  ipcCleanups.forEach((cleanFn) => cleanFn());
  ipcCleanups.splice(0, ipcCleanups.length);
  clearMessageHandlers();
  //console.log('!!! onUnmounted done !!!', ipcCleanups, messageHandlers);
});


let socket: Socket|null = null;
let socketTimeout = 1000;
let disconnectSocket = false;

const startWebsocketClient = () => {
  if (!CONFIG.WS_URL) {
    console.error('No WebSocket URL');
    return;
  }

  if (socket) {
    //socket.close();
    return;
  }

  if (!user.value?.token) {
    console.error('No user token for WebSocket connection');
    return;
  }

  try {
    socket = io(CONFIG.WS_URL, {
      auth: {
        token: user.value?.token,
      },
    });
  } catch (e) {
    console.error('WebSocket error:', e);
    setTimeout(() => {
      startWebsocketClient();
    }, socketTimeout);
    socketTimeout *= 2;
    return;
  }

  socketTimeout = 1000;

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
    if (!socket) {
      return;
    }

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      socket = null;
      if (disconnectSocket) {
        disconnectSocket = false;
        return;
      }
      setTimeout(() => {
        startWebsocketClient();
      }, 1000);
    });

    socket.on('treeUpdated', async (data) => {
      console.log('Tree Updated server message:', data);
      if (data.clientId !== socket?.id) {
        // restart sync
        if (!running.value) {
          restartSync();
        } else if (!stopping.value) {
          await stopSync(StopReason.REMOTE);
          restartSync();
        }
      } else {
        console.log('Ignoring own message');
      }
    });
  });
};

const stopWebsocketClient = () => {
  if (socket) {
    disconnectSocket = true;
    socket.close();
  }
};


let loggedIn = false;

watchEffect(async () => {
  console.log('Current wallet:', currentWallet.value);
  if (!currentWallet.value)
    return;

  if (user.value?.token && loggedIn)
     return;

  if (user?.value?.token) {
    if (activeSubscription.value.plan_code) {
      loggedIn = true;
      syncActive.value = true;
      console.log('>>> starting')
      startWebsocketClient();
      ipcSend('getDirectory', currentWallet.value.id);
    }
  } else {
    await loginOrRegisterUser(getCurrentWalletId.value, user?.value?.unlockPassword);
  }

});


enum StopReason {
  LOCAL = 'Stopping sync for restart due to local files changed...',
  REMOTE = 'Stopping sync for restart due to remote files changed...',
  OTHER = 'Stopping sync...',
}

let stopWaiter:any;
const stopSync = async (reason:StopReason) => {
  stopping.value = true;
  state.messages.push(reason);
  const stopPromise = new Promise((resolve, reject) => {
    stopWaiter = {resolve, reject};
  });
  return stopPromise;
};
watch(running, async (value) => {
  if (!value && stopWaiter) {
    const {resolve, reject} = stopWaiter;
    stopWaiter = null;
    stopping.value = false;
    resolve();
  }
});

const restartSync = () => {
  //state.messages = [];
  state.messages.push('Restarting sync due to remote files changed...');
  ipcSend('getFileTree');
};

const toggleSync = async () => {
  if (syncActive.value) {
    syncActive.value = false;
    stopWebsocketClient();
    if (running.value) {
      await stopSync(StopReason.OTHER);
    }
  } else {
    if (user.value?.token && activeSubscription.value.plan_code) {
      syncActive.value = true;
      stoppedByLimits.value = false;
      state.messages = [];
      startWebsocketClient();
      ipcSend('getFileTree');
    }
  }
}

const inactivateSync = () => {
  state.messages.push('Synchronization error, stopped.');
  running.value = false;
  syncActive.value = false;
  stopWebsocketClient();
}

watch(activeSubscription, async (value, oldValue) => {
  if (!syncActive.value && stoppedByLimits.value && value && value.plan_code && value.plan_code !== oldValue?.plan_code) {
    await loadUsage(getCurrentWalletId.value);
    toggleSync();
  }
});

const chooseDirectory = () => ipcSend('chooseDirectory')
const openDirectory = () => ipcSend('openDirectory')

ipcOn('directorySelected', async (event, path, synced) => {
  state.directory = path;
  state.directorySynced = synced;
  state.messages = [];
  if (!syncActive.value && stoppedByLimits.value) {
    await loadUsage(getCurrentWalletId.value);
    toggleSync();
  }
})

//ipcSend('getDirectory');

ipcOn('quit', async (event) => {
  console.log('Quit event received');
  if (running.value) {
    await stopSync(StopReason.OTHER);
  }
  await userLogout();
  ipcSend('quit');
});

const chunkWaiters = new Map();

const requestFileRead = async (id: number, path: string) => {
  return new Promise((resolve, reject) => {
    chunkWaiters.set(id, {resolve, reject});
    ipcSend('readFile', id, path);
  });
}
const requestNextChunk = (id: number, fd: any) => {
  return new Promise((resolve, reject) => {
    chunkWaiters.set(id, {resolve, reject});
    ipcSend('readNextChunk', id, fd);
  });
}

ipcOn('chunkRead', (event, id, fd, chunk, bytesRead, eof) => {
  const {resolve, reject} = chunkWaiters.get(id);
  chunkWaiters.delete(id);

  console.log('Chunk read:', id, fd, chunk, bytesRead, eof);
  if(!fd) {
    return reject('No file descriptor');
  }
  console.log(`Read: ${bytesRead}`);
  resolve({ fd, chunk, bytesRead, eof });
});

ipcOn('addMessage', (event, message) => {
  state.messages.push(message);
});
ipcOn('replaceMessage', (event, message, oldMessage) => {
  if (state.messages[state.messages.length - 1] === oldMessage) {
    state.messages[state.messages.length - 1] = message;
  } else {
    state.messages.push(message);
  }
});

ipcOn('filetree', async (event, filetree) => {
  if (running.value) {
    await stopSync(StopReason.LOCAL);
    state.messages.push('Restarting sync due to local files changed...');
  }
  if (!syncActive.value) {
    return;
  }
  running.value = true;

  //console.log('Filetree:', filetree);
  localTree.value = parseFileTreeModel(filetree);
  console.log('Local tree:', localTree.value?.model);
  //state.messages.push(`Filetree: ${JSON.stringify(filetree)}`);
  if (user.value?.token && activeSubscription.value.plan_code) {
    fetchRemoteTree();
  }
});

const fetchRemoteTree = async () => {
  const token = user.value?.token;
  const r = await fetch(`${CONFIG.API_HOST}/api/sync/tree`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${token}`,
    },
  });
  console.log('fetchRemoteTree response:', r);

  if (stopping.value) {
    running.value = false;
    return;
  }

  let encodedTree;
  try {
    //const t = await r.text();
    //console.log('Text:', t);
    const j = await r.json();
    //console.log('JSON:', j);
    const s = new TextDecoder().decode(Uint8Array.from(j.data))
    //console.log('String:', s);
    encodedTree = JSON.parse(s);
    //console.log('Encoded tree:', encodedTree);
  } catch (e) {
    console.error('No remote tree:', e);
  }
  if (encodedTree) {
    sendMessage('hat-sh', [ "decryptBuffer", encodedTree, JSON.stringify(user.value?.unlockPassword) ], 'background');
  } else {
    processTrees();
  }
}

const onRemoteTreeDecrypted = async (decrypted) => {
  console.log('Remote tree decrypted:', decrypted);

  if (stopping.value) {
    running.value = false;
    return;
  }

  const tree = JSON.parse(decrypted);
  remoteTree.value = parseFileTreeModel(tree);
  console.log('Remote tree:', remoteTree.value?.model);
  processTrees();
}

let diffs:FileDiffs;

const processTrees = async () => {

  if (stopping.value) {
    running.value = false;
    return;
  }

  diffs = diffTrees(localTree.value, remoteTree.value, !state.directorySynced);
  console.log('Upload diff:', diffs.upload);
  console.log('Remove diff:', diffs.remove);
  console.log('Local remove diff:', diffs.localRemove);
  console.log('Download diff:', diffs.download);
  console.log('Merged tree:', diffs.merged);
  state.messages.push('Syncing...');
  if (diffs.remove.length > 0) {
    await removeRemoteFiles(diffs.remove);
    await loadUsage(getCurrentWalletId.value);
  }

  if (!running.value) {
    return;
  }

  try {
    await uploadFiles(diffs.upload);
    await loadUsage(getCurrentWalletId.value);
  } catch(error) {
    console.error('Error:', error);
    inactivateSync();
  }
}

const removeRemoteFiles = async(diff:FileTreeModel[]) => {
  const deletionPromises = [] as Promise<void>[];
  diff.forEach((item:FileTreeModel) => {
    if (!item)
      return;
    deletionPromises.push(new Promise(async (resolve, reject) => {
      const node:FileTreeNode = item.model;
      state.messages.push(node.type === 'directory' ? `Deleting remote directory: ${node.path}` : `Deleting remote file: ${node.path}`);
      const path = '.sync/' + node.path + (node.type === 'directory' ? '/' : '');
      const pathType = node.type === 'directory' ? 'dir' : 'file';
      await api.objects.objectsDelete2(getCurrentWalletId.value, { query: { pathType, path } } as any);
      resolve();
    }));
  });

  try {
    await Promise.all(deletionPromises);
  } catch (error) {
    console.error('Error deleting remote files:', error);
    inactivateSync();
  }
}

const uploadFiles = async (diff:FileTreeModel[]) => {
  /*
  const r = await getObjects('/');
  if (r.files.length === 0) {
    await createFolder('', '');
  }
  await createFolder('/', '.sync');
  */

  if (diff.length > 0)
    state.messages.push('Uploading files...');

  numberOfFiles = 0;
  let totalFileSize = 0;
  queue.value = [];
  diff.forEach((item) => {
    item?.walk((node) => {

      if (stopping.value) {
        running.value = false;
        return false;
      }

      if (node.model.type === 'directory' && node.model.path) {
        console.log('Dir:', node.model);
        //createFolder('/.sync', node.model.path);
        state.messages.push(`Folder: ${node.model.path}`);
      } else if (node.model.type === 'file') {
        console.log('File:', node.model);
        state.messages.push(`Staging file for upload: ${node.model.path}`);
        numberOfFiles++;
        totalFileSize += node.model.size;
        queue.value.push({id: queue.value.length+1, file: node.model});
      }
      return true;
    });
  });

  if (stopping.value) {
    running.value = false;
    return;
  }

  if (numberOfFiles > 0) {
    const planCode = activeSubscription.value.plan_code;
    // console.log('planCode', planCode)
    // console.log('totalFileSize', totalFileSize)
    // console.log('TRIAL_PLAN_LIMIT', CONFIG.TRIAL_PLAN_LIMIT * 1024 * 1024)
    // console.log('usage', userUsage.value, (userUsage.value as any)?.customer_usage.charges_usage[0].units)
    if (!planCode || ((planCode.startsWith('TRIAL')
            && totalFileSize + parseInt((userUsage.value as any)?.customer_usage.charges_usage[0].units) > CONFIG.TRIAL_PLAN_LIMIT * 1024 * 1024) ||
        (planCode.startsWith('MEDIUM')
            && totalFileSize + parseInt((userUsage.value as any)?.customer_usage.charges_usage[0].units) > CONFIG.MEDIUM_PLAN_LIMIT * 1024 * 1024) ||
        (planCode.startsWith('LARGE')
            && totalFileSize + parseInt((userUsage.value as any)?.customer_usage.charges_usage[0].units) > CONFIG.LARGE_PLAN_LIMIT * 1024 * 1024))
    ) {
      inactivateSync();
      state.messages.push('Storage limit exceeded, please upgrade your plan.');
      stoppedByLimits.value = true;
      return;
    }

    currFile.value = 0;
    prepareFile();
  } else {
    onUploadFinished();
  }
}

const onUploadFinished = async () => {

  if (stopping.value) {
    running.value = false;
    return;
  }

  if (diffs.localRemove.length > 0) {
    await removeLocalFiles(diffs.localRemove);
  }

  downloadFiles(diffs.download);
}

const removeWaiters = new Map();
const removeLocalFiles = async (diff:FileTreeModel[]) => {
  const deletionPromises = [] as Promise<void>[];
  diff.forEach((item:FileTreeModel) => {
    if (!item)
      return;
    deletionPromises.push(new Promise(async (resolve, reject) => {
      const node:FileTreeNode = item.model;
      state.messages.push(node.type === 'directory' ? `Deleting directory: ${node.path}` : `Deleting file: ${node.path}`);
      removeWaiters.set(node.path, {resolve, reject});
      ipcSend('removeFile', node.path);
    }));
  });

  await Promise.all(deletionPromises);
};
ipcOn('fileRemoved', (event, path, state) => {
  const {resolve, reject} = removeWaiters.get(path);
  removeWaiters.delete(path);
  resolve(state);
});

const downloadFiles = async (diff:FileTreeModel[]) => {
  if (diff.length > 0)
    state.messages.push('Downloading files...');

  const items:FileTreeModel[] = [];

  diff.forEach((item) => {
    item?.walk((node) => {

      if (stopping.value) {
        running.value = false;
        return false;
      }

      if (node.model.type === 'directory' && node.model.path) {
        console.log('Dir:', node.model);
        ipcSend('createDirectory', node.model.path);
        state.messages.push(`Folder: ${node.model.path}`);
      } else if (node.model.type === 'file') {
        console.log('File:', node.model);
        state.messages.push(`Staging file for download: ${node.model.path}`);
        items.push(node);
        //queue.value.push({id: queue.value.length+1, file: node.model});
      }
      return true;
    });
  });

  if (stopping.value) {
    running.value = false;
    return;
  }

  if (items.length > 0) {
    download(items);
  } else {
    onDownloadFinished();
  }
}

let storeTreeWaiter:any;
let storeTreePromise:Promise<void>;

const onDownloadFinished = async () => {

  if (stopping.value) {
    running.value = false;
    return;
  }

  storeTreePromise = new Promise((resolve, reject) => {
    storeTreeWaiter = {resolve, reject};
  });

  storeTreeModel();

  await storeTreePromise;

  if (stopping.value) {
    running.value = false;
    return;
  }

  ipcSend('directorySynced', currentWallet.value.id);
  state.directorySynced = true;

  state.messages.push('Synced');
  running.value = false;
}


const storeTreeModel = async () => {
  encryptTreeModel();
}

const encryptTreeModel = async () => {
  const tree = diffs.merged?.model||{};
  const treeString = JSON.stringify(tree);
  sendMessage('hat-sh', [ "encryptBuffer", treeString, JSON.stringify(user.value?.unlockPassword) ], 'background');
};

const onTreeModelEncrypted = async (encryptedData) => {
  const base64data = {
    salt: encodeArrayBufferToUrlSafeBase64(encryptedData.salt),
    header: encodeArrayBufferToUrlSafeBase64(encryptedData.header),
    encrypted: encodeArrayBufferToUrlSafeBase64(encryptedData.encrypted),
  }
  const base64body = encodeArrayBufferToUrlSafeBase64(new TextEncoder().encode(JSON.stringify(base64data)).buffer as ArrayBuffer);
  //console.log('Local tree encrypted:', base64data);

  if (stopping.value) {
    running.value = false;
    return;
  }

  const token = user.value?.token;
  const r = await fetch(`${CONFIG.API_HOST}/api/sync/tree`, {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tree: base64body, clientId: socket?.id }),
  });
  console.log('store TreeModel response:', r);
  const { resolve, reject } = storeTreeWaiter;
  resolve();
};

const getObjects = async (path, isSearch = false, params = {} as any) => {
  const currentDir = getCurrentDir(getCurrentWalletId.value, path);
  const pathType = currentDir.endsWith('/') ? 'dir' : 'file';
  console.log('%cGet objects: ' + currentDir, 'background: #222; color: #bada55')
  let data = { entries: [] as any[]|{} } as any;
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
      extension = entry.name.split('.').pop();
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

const createFolder = async (path, name) => {
  const currentDir = getCurrentDir(getCurrentWalletId.value, path);
  path = currentDir + name
  if (!currentDir.endsWith('/')) {
    path += '/'
  }

  const data = await api.objects.objectsUpdate(getCurrentWalletId.value, null, {query: {pathType: 'dir', path: path}} as any ).then(res => res.data);
  return data;
};

onMessage('hat-sh-response', async (message) => {
  const {data, sender} = message;

  if (!Array.isArray(data)) {
    console.error('unexpected message', message);
    return;
  }

  const action = data[0];
  console.log('Sync - onMessage:', action, data);

  let params = [] as any[], idx;

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

        currFile.value += 1;
        if (currFile.value < numberOfFiles) {
          setTimeout(function () {
              prepareFile();
            }, 1000);
        }
      }
      break;
    case "uploadingFinished":
      console.log('uploadingFinished (Sync)')
      idx = queue.value.findIndex((item) => item.id === params[0]);
      if (idx !== -1) {
        const item = queue.value[idx];
        console.log('File uploaded:', item.file.path);
        state.messages.push(`File uploaded: ${item.file.path}`);
        if (currFile.value >= numberOfFiles) {
          onUploadFinished();
        }
      }
      setTimeout(()=> {
        loadUsage(getCurrentWalletId.value)
        loadSubscriptions(getCurrentWalletId.value)
      }, 3000)

      break;
    case "limitExceeded":
    case "uploadError":
      //emitter.emit('vf-modal-close');
      //emitter.emit('vf-toast-push', {label: params[1]});

      const queueIdx = queue.value.findIndex((item) => item.id === params[0]);
      if (queueIdx !== -1) {
        const item = queue.value[queueIdx];
        console.log('Error uploading file:', item.file.path, params[1]);
        state.messages.push(`Error uploading file: ${item.file.path}: ${params[1]}`);
        inactivateSync();
        /*const currentDir = getCurrentDir(props.currentWalletId, props.current.dirname);

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
        });*/

        //queue.value.splice(queueIdx, 1);
      }
      break;
  }
});

onMessage('hat-sh-buffer', async (message) => {
  const { action, data } = message;
  console.log('Sync/buffer - onMessage:', action, data);

  switch (action) {
    case 'bufferEncrypted':
      onTreeModelEncrypted(data);
      break;
    case 'bufferDecrypted':
      onRemoteTreeDecrypted(new TextDecoder().decode(data));
      break;
    }
});

const prepareFile = async () => {

  if (stopping.value) {
    running.value = false;
    return;
  }

  // send file name to sw
  const item = queue.value[currFile.value];
  state.messages.push(`Uploading file: ${item.file.path}`);
  let fileName = encodeURIComponent(item.file.name + ".enc");
  console.trace("prepareFile")
  await sendMessage('hat-sh', [ "prepareFileNameEnc", fileName ], 'background');
};

const startEncryption = (method) => {
  const item = queue.value[currFile.value];
  requestFileRead(item.id, item.file.path)
      .then(async (value) => {
        const { fd, chunk, bytesRead, eof } = value as { fd: any; chunk: ArrayBuffer; bytesRead: number; eof: boolean };
        item.fd = fd;

        const chunkString = encodeArrayBufferToUrlSafeBase64(chunk.slice(0, bytesRead));

        if (method === "secretKey") {
          await sendMessage('hat-sh', [ "encryptFirstChunk", chunkString, eof, item.id ], 'background');
        }
        if (method === "publicKey") {
          await sendMessage('hat-sh', [ "asymmetricEncryptFirstChunk", chunkString, eof, item.id ], 'background');
        }
      });

};

const kickOffEncryption = async () => {
  if (currFile.value <= numberOfFiles - 1) {
    //file = files.value[currFile.value];
    const item = queue.value[currFile.value];

    //queue.value[queue.value.findIndex((item) => item.id === file.id)].status = 'encrypting';
    item.status = 'encrypting';

    // window.open(`file`, "_self");
    /*
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
    */

    await sendMessage('hat-sh', [ "doStreamFetch",
      `${CONFIG.API_HOST}/api/objects/` + getCurrentWalletId.value + '?pathType=file' + '&path=' + encodeURIComponent('/.sync/' + item.file.path),
      user?.value?.token, item.id
    ], 'background');

    //isDownloading.value = true;

    /*
    if (encryptionMethodState === "publicKey") {

      let mode = "derive";

      await sendMessage('hat-sh', [ "requestEncKeyPair", privateKey, publicKey, mode ], 'background');
    }
    */

    //if (encryptionMethodState === "secretKey") {
    await sendMessage('hat-sh', [ "requestEncryption", JSON.stringify(user.value?.unlockPassword) ], 'background');
    //}
  } else {
    // console.log("out of files")
  }
};

const continueEncryption = () => {
  const item = queue.value[currFile.value];
  requestNextChunk(item.id, item.fd)
      .then(async (value) => {
        const { fd, chunk, bytesRead, eof } = value as { fd: any; chunk: ArrayBuffer; bytesRead: number; eof: boolean };

        const chunkString = encodeArrayBufferToUrlSafeBase64(chunk.slice(0, bytesRead));

        await sendMessage('hat-sh', [ "encryptRestOfChunks", chunkString, eof, item.id ], 'background');
      });
};

let dlItems:FileTreeModel[];
let currItem:number;
let decWaiter:any;
let writeWaiter:any;
let tempFileWaiter:any;
let renameWaiter:any;

type TmpFile = { path: string; fd: any; };

const download = async (items:FileTreeModel[]) => {
  dlItems = items;
  currItem = 0;
  downloadItem();
};

const downloadItem = async () => {
  const item = dlItems[currItem];
  if(!item) {
    onDownloadFinished();
    return;
  }

  state.messages.push(`Downloading file: ${item.model.path}`);
  console.log('Downloading:', item.model.path);
  const data = await downloadObject(item.model.path);
  console.log('Fetched data:', data);

  const tmpFile = await createTempFile(item.model.path.split('/').slice(0, -1).join('/'));
  console.log('Temp file:', tmpFile);

  const file = data;
  const signature = await file.slice(0, 11).arrayBuffer();
  const salt = await file.slice(11, 27).arrayBuffer();
  const header = await file.slice(27, 51).arrayBuffer();
  let index = 51;
  let fd:any;
  while(index < data.size) {
    const chunk = await file.slice(index, index + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES).arrayBuffer();
    const newIndex = index + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES;
    const decPromise = new Promise<ArrayBuffer>((resolve, reject) => {
      decWaiter = {resolve, reject};
    });
    await sendMessage('hat-sh', [ "decryptFileChunk",
      JSON.stringify(user.value?.unlockPassword),
      encodeArrayBufferToUrlSafeBase64(signature),
      encodeArrayBufferToUrlSafeBase64(salt),
      encodeArrayBufferToUrlSafeBase64(header),
      encodeArrayBufferToUrlSafeBase64(chunk),
      newIndex >= data.size
    ], 'background');
    const decChunk:ArrayBuffer = await decPromise;

    const writePromise = new Promise((resolve, reject) => {
      writeWaiter = {resolve, reject};
    });
    /*
    if (index === 51) {
      ipcSend('writeFile', currItem+1, item.model.path, Buffer.from(decChunk), decChunk.byteLength, newIndex >= data.size);
    } else {
      ipcSend('writeNextChunk', currItem+1, fd, Buffer.from(decChunk), decChunk.byteLength, newIndex >= data.size);
    }
    fd = await writePromise;
    */
    ipcSend('writeNextChunk', currItem+1, tmpFile.fd, Buffer.from(decChunk), decChunk.byteLength, newIndex >= data.size);
    await writePromise;
    index = newIndex;
  }
  await renameFile(tmpFile.path, item.model.path);
  currItem++;
  if (currItem < dlItems.length) {
    downloadItem();
  } else {
    onDownloadFinished();
  }
};

const downloadObject = async (path) => {
  const response = await api.objects.objectsDetail(
      getCurrentWalletId.value,
      { query: { pathType: 'file',
          path: encodeURIComponent('.sync/' + path),
          serviceName: 'worker', format: 'blob' }, format: 'blob'} as any
  );
  return response.data;
};

onMessage('hat-sh-file', async (message) => {
  const { action, data } = message;
  console.log('Sync/file - onMessage:', action, data);

  switch (action) {
    case 'chunkDecrypted':
      onChunkDecrypted(data);
      break;
    }
});

const onChunkDecrypted = async (decrypted) => {
  const decChunk = decodeUrlSafeBase64ToArrayBuffer(decrypted);
  const {resolve, reject} = decWaiter;
  resolve(decChunk);
};

ipcOn('chunkWritten', (event, id, fd, bytes, eof) => {
  console.log('Chunk written:', id, fd, bytes, eof);
  const {resolve, reject} = writeWaiter;

  if (!fd) {
    reject("No write file descriptor");
    return;
  }
  resolve(fd);
});

const createTempFile = async (path) => {
  const tempFilePromise = new Promise<TmpFile>((resolve, reject) => {
    tempFileWaiter = {resolve, reject};
  });
  ipcSend('createTempFile', path);
  return tempFilePromise;
};

ipcOn('tempFileCreated', (event, err, path, fd) => {
  const {resolve, reject} = tempFileWaiter;
  if (err) {
    reject(err);
    return;
  }
  resolve({ path, fd });
});

const renameFile = async (oldPath, newPath) => {
  const renamePromise = new Promise((resolve, reject) => {
    renameWaiter = {resolve, reject};
  });
  ipcSend('renameFile', oldPath, newPath);
  return renamePromise;
};

ipcOn('fileRenamed', (event, err) => {
  const {resolve, reject} = renameWaiter;
  if (err) {
    reject(err);
    return;
  }
  resolve();
});
</script>

<template>
  <div class="sync-page">
      <div class="wallets-detail">
        <transition name="fade-top" mode="out-in">
          <wallet-display
              v-if="currentWallet"
              :wallet="currentWallet"
              :wallets="allWallets"
              :active="true"
              :key="currentWallet.id"
              mode="info-only"/>
        </transition>
      </div>

    <div class="directory" v-if="state.directory"><a href="#" @click="openDirectory">{{ state.directory }}</a></div>
    <div class="directory" v-else>Directory not selected</div>
    <div class="actions">
      <div class="action">
        <a target="_blank" rel="noreferrer" @click="chooseDirectory">Choose directory</a>
      </div>
      <a class="start-stop-button" target="_blank" rel="noreferrer" @click="toggleSync">
        <span v-if="syncActive" class="material-symbols-outlined" title="Pause synchronization">pause_circle</span>
        <span v-else class="material-symbols-outlined" title="Start synchronization">not_started</span>
      </a>
    </div>
    <div v-if="!activeSubscription.plan_code" class="warning">
      <p>You need to have an active subscription to use this feature.</p>
      <p>Go to <router-link :to="{ name: 'wallets' }">Account</router-link> to subscribe.</p>
    </div>
    <div v-if="stoppedByLimits" class="warning">
      <p>Storage limit exceeded, please upgrade your plan.</p>
      <p>Go to <router-link :to="{ name: 'wallets' }">Account</router-link> to subscribe.</p>
    </div>
    <div class="messages">
      <ul>
        <li v-for="message in state.messages" :key="message">{{ message }}</li>
      </ul>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
@require "../styles/vars";

.sync-page {
  display: flex;
  flex-direction: column;
  padding: 15px 10px 20px 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.wallets-detail {
  margin-left: -10px;
}

.actions {
  display: flex;
  padding-top: 12px;
  margin: -6px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.action {
  flex-shrink: 0;
  padding: 6px;
}

.action a {
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  border-radius: 5px;
  border: 3px solid #E4B857;
  background: #E4B857;
  color: #272626;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
}

.action a:hover {
  border: 3px solid #D06B57;
}

.start-stop-button {
  flex: 1;
  text-align: right;
  padding: 15px 15px 0 0;
  cursor: pointer;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  color: #E4B857;
}
.material-symbols-outlined:hover {
  color: #D06B57;
}

.directory {
  width: 100%;
  height: 65px;
  padding: 10px 20px 14px 20px;
  border-radius: 30px;
  border: 5px solid #E3CCA9;
  background: #8AA8AC;
  overflow: hidden;
  text-overflow: ellipsis;
}
.directory a {
  color: primary-light;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.messages {
  margin-top: 20px;
  height: 550px;
  width: 100%;
  overflow-y: auto;
}

.warning {
  padding: 20px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  color: #721c24;
  margin-top: 20px;
  text-align: center;
  font-weight: 600;
}

.warning a {
  text-decoration: underline;
}
</style>
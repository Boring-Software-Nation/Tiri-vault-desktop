<script setup lang="ts">
import { CONFIG } from "~/env";
import { reactive, computed, onMounted, ref, watchEffect, unref, shallowRef} from "vue";
import { storeToRefs } from 'pinia';
import { userStorage, useUserStore } from '~/store/user';
import { useWalletsStore } from "~/store/wallet";
import { loginOrRegisterUser } from "~/services/backend";
import { decodeUrlSafeBase64ToArrayBuffer, encodeArrayBufferToUrlSafeBase64 } from "~/utils/base64";
import { FileTreeModel, FileTreeNode, diffTrees, parseFileTreeModel } from "~/utils/filetreemodel";
import getCurrentDir, {storageName} from "~/utils/getCurrentDir";
import { api } from "@renderer/services";
import { onMessage, sendMessage } from '~/hat-sh/';

const walletStore = useWalletsStore();
const { allWallets, pushNotification, getSelectedWallet } = walletStore;
const { currentWallet, getCurrentWalletId } = storeToRefs(walletStore);
const userStore = useUserStore();
const { loadUsage, loadSubscriptions } = userStore;
const { user } = storeToRefs(userStore);
const selectedWallet = ref(null);

const localTree = shallowRef<FileTreeModel>(null);
const remoteTree = shallowRef<FileTreeModel>(null);

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
const ipcOn = (channel, listener) => window.electron.ipcRenderer.on(channel, listener);

onMounted(() => {
  selectedWallet.value = getSelectedWallet.value || null;
});

watchEffect(async () => {
  console.log('Current wallet:', currentWallet.value);
  if (!currentWallet.value)
    return;

  if (!user?.value?.token) {
    await loginOrRegisterUser(getCurrentWalletId.value, user?.value?.unlockPassword);
    if (localTree.value) {
      fetchRemoteTree();
    }
  }
});

//const userStore = useUserStore();
//const { user } = storeToRefs(userStore)

const state = reactive({
  directory: '',
  messages: [] as string[],
});

/*
const write = {
  writing: false,
  writeFd: null,
  writeQueue: [] as { chunk: Buffer, bytes: number, eof: boolean }[],
}

const writeQueuedChunk = () => {
  if (!write.writeFd) {
    state.messages.push("Queue: no write file descriptor");
    return;
  }
  if (write.writeQueue.length) {
    const q = write.writeQueue.shift();
    if (q) {
      state.messages.push(`Writing: ${q.bytes}, eof: ${q.eof}, queue length: ${write.writeQueue.length}`);
      window.electron.ipcRenderer.send('writeNextChunk', write.writeFd, q.chunk, q.bytes, q.eof);
    }
  }
}
*/

const chooseDirectory = () => ipcSend('chooseDirectory')
const openDirectory = () => ipcSend('openDirectory')

ipcOn('directorySelected', (event, result) => {
  state.directory = result;
})
ipcSend('getDirectory');


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

  console.log('Chunk read:', id, fd, chunk, bytesRead, eof);
  if(!fd) {
    return reject('No file descriptor');
  }
  console.log(`Read: ${bytesRead}`);
  resolve({ fd, chunk, bytesRead, eof });
});

/*
  if (write.writing) {
    write.writeQueue.push({ chunk, bytes: bytesRead, eof });
    state.messages.push(`Queued to write, queue length: ${write.writeQueue.length}`);
    if(write.writeFd) {
      writeQueuedChunk();
    }
  } else {
    write.writing = true;
    state.messages.push(`Start writing 2.dat: ${bytesRead}, eof: ${eof}`);
    window.electron.ipcRenderer.send('writeFile', '2.dat', chunk, bytesRead, eof);
  }
  if (!eof) {
    readNextChunk(fd);
  }
*/

/*
window.electron.ipcRenderer.on('chunkWritten', (event, fd, bytes, eof) => {
  console.log('Chunk written:', fd, bytes, eof);
  if (!fd) {
    state.messages.push("No write file descriptor");
    write.writeFd = null;
    return;
  }
  if (eof) {
    state.messages.push(`Writing finished, queue length: ${write.writeQueue.length}`);
    write.writing = false;
    write.writeFd = null;
    return;
  }
  write.writeFd = fd;
  state.messages.push(`Written: ${bytes}`);
  writeQueuedChunk();
})
*/

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
  //console.log('Filetree:', filetree);
  localTree.value = parseFileTreeModel(filetree);
  console.log('Local tree:', localTree.value?.model);
  //state.messages.push(`Filetree: ${JSON.stringify(filetree)}`);
  if (user.value?.token) {
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
  let encodedTree;
  try {
    //const t = await r.text();
    //console.log('Text:', t);
    const j = await r.json();
    //console.log('JSON:', j);
    const s = String.fromCodePoint(...j.data)
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
  const tree = JSON.parse(decrypted);
  remoteTree.value = parseFileTreeModel(tree);
  console.log('Remote tree:', remoteTree.value?.model);
  processTrees();
}

const processTrees = async () => {
  const { upload, remove, localRemove, download } = diffTrees(localTree.value, remoteTree.value);
  console.log('Upload diff:', upload);
  state.messages.push('Syncing...');
  uploadFiles(upload);
}

const uploadFiles = async (diff:FileTreeModel[]) => {
  const r = await getObjects('/');
  if (r.files.length === 0) {
    await createFolder('', '');
  }
  await createFolder('/', '.sync');

  numberOfFiles = 0;
  queue.value = [];
  diff.forEach((item) => {
    item?.walk((node) => {
      if (node.model.type === 'directory' && node.model.path) {
        console.log('Dir:', node.model);
        createFolder('/.sync', node.model.path);
        state.messages.push(`Folder: ${node.model.path}`);
      } else if (node.model.type === 'file') {
        console.log('File:', node.model);
        state.messages.push(`Staging file for upload: ${node.model.path}`);
        numberOfFiles++;
        queue.value.push({id: queue.value.length+1, file: node.model});
      }
      return true;
    });
  });
  if (numberOfFiles > 0) {
    currFile.value = 0;
    prepareFile();
  } else {
    onUploadFinished();
  }
}

const onUploadFinished = () => {
  storeLocalTree();
  state.messages.push('Synced');
}

const storeLocalTree = async () => {
  encryptLocalTree();
}

const encryptLocalTree = async () => {
  const tree = localTree.value?.model;
  const treeString = JSON.stringify(tree);
  sendMessage('hat-sh', [ "encryptBuffer", treeString, JSON.stringify(user.value?.unlockPassword) ], 'background');
};

const onLocalTreeEncrypted = async (encryptedData) => {
  const base64data = {
    salt: encodeArrayBufferToUrlSafeBase64(encryptedData.salt),
    header: encodeArrayBufferToUrlSafeBase64(encryptedData.header),
    encrypted: encodeArrayBufferToUrlSafeBase64(encryptedData.encrypted),
  }
  const base64body = encodeArrayBufferToUrlSafeBase64(new TextEncoder().encode(JSON.stringify(base64data)).buffer);
  //console.log('Local tree encrypted:', base64data);

  const token = user.value?.token;
  const r = await fetch(`${CONFIG.API_HOST}/api/sync/tree`, {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tree: base64body }),
  });
  console.log('storeLocalTree response:', r);
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
      onLocalTreeEncrypted(data);
      break;
    case 'bufferDecrypted':
      onRemoteTreeDecrypted(String.fromCodePoint(...data));
      break;
    }
});

const updateCurrFile = () => {
  currFile.value += 1;
};

const prepareFile = async () => {
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

</script>

<template>
  <div class="test">
    <div class="directory" v-if="state.directory"><a href="#" @click="openDirectory">{{ state.directory }}</a></div>
    <div class="directory" v-else>Directory not selected</div>
    <div class="actions">
      <div class="action">
        <a target="_blank" rel="noreferrer" @click="chooseDirectory">Choose directory</a>
      </div>
    </div>
    <div class="messages">
      <ul>
        <li v-for="message in state.messages" :key="message">{{ message }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.test {
  display: flex;
  flex-direction: column;
  padding: 20px 10px 20px 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
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
  border: 1px solid white;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  border-radius: 20px;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
  color: white;
}

.action a:hover {
  background-color: #333;
}

.directory {
  width: 100%;
  padding: 10px 20px 14px 20px;
  border-radius: 20px;
  background: #333;
  overflow: hidden;
  text-overflow: ellipsis;
}
.directory a {
  color: white;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.messages {
  margin-top: 20px;
  height: 550px;
  width: 100%;
  overflow-y: auto;
}
</style>
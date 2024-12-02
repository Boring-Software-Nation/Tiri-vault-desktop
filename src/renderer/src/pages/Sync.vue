<script setup lang="ts">
import { CONFIG } from "~/env";
import { reactive, computed, onMounted, ref, watchEffect, unref, shallowRef} from "vue";
import { storeToRefs } from 'pinia';
import { userStorage, useUserStore } from '~/store/user';
import { useWalletsStore } from "~/store/wallet";
import { loginOrRegisterUser } from "~/services/backend";
import { encodeArrayBufferToUrlSafeBase64 } from "@renderer/utils/base64";
import TreeModel from "tree-model";
import getCurrentDir, {storageName} from "~/utils/getCurrentDir";
import { api } from "@renderer/services";

const walletStore = useWalletsStore();
const { allWallets, pushNotification, getSelectedWallet } = walletStore;
const { currentWallet, getCurrentWalletId } = storeToRefs(walletStore);
const { user } = storeToRefs(useUserStore());
const selectedWallet = ref(null);

type FileTreeNode = {
  name: string,
  path: string,
  type: 'file'|'directory',
  mtime: number,
  hash?: string,
  children?: FileTreeNode[]
}
type FileTreeModel = TreeModel.Node<FileTreeNode>|null;

const treeModel = new TreeModel();

const localTree = shallowRef<FileTreeModel>(null);
const remoteTree = shallowRef<FileTreeModel>(null);

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

const chooseDirectory = () => window.electron.ipcRenderer.send('chooseDirectory')
const openDirectory = () => window.electron.ipcRenderer.send('openDirectory')
const readFile = () => {
  if (write.writing) {
    state.messages.push("Writing in progress, please wait");
    return;
  }
  write.writeFd = null;
  write.writeQueue = [] as { chunk: Buffer, bytes: number, eof: boolean }[];
  state.messages = [] as string[];
  window.electron.ipcRenderer.send('readFile', '1.dat')
}
const readNextChunk = (fd) => window.electron.ipcRenderer.send('readNextChunk', fd)

window.electron.ipcRenderer.on('directorySelected', (event, result) => {
  state.directory = result;
})

window.electron.ipcRenderer.send('getDirectory');

window.electron.ipcRenderer.on('chunkRead', (event, fd, chunk, bytesRead, eof) => {
  console.log('Chunk read:', fd, chunk, bytesRead, eof);
  if(!fd) {
    state.messages.push("No file descriptor");
    return;
  }
  state.messages.push(`Read: ${bytesRead}`);
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
})

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

window.electron.ipcRenderer.on('addMessage', (event, message) => {
  state.messages.push(message);
});

window.electron.ipcRenderer.on('replaceMessage', (event, message, oldMessage) => {
  if (state.messages[state.messages.length - 1] === oldMessage) {
    state.messages[state.messages.length - 1] = message;
  } else {
    state.messages.push(message);
  }
});

window.electron.ipcRenderer.on('filetree', async (event, filetree) => {
  //console.log('Filetree:', filetree);
  localTree.value = treeModel.parse(filetree);
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
  let tree = {};
  try {
    const j = await r.json();
    //console.log('JSON:', j);
    const s = String.fromCodePoint(...j.data)
    //console.log('String:', s);
    tree = JSON.parse(s);
    //console.log('Tree:', tree);
  } catch (e) {
    console.error('No remote tree:', e);
  }
  remoteTree.value = treeModel.parse(tree);
  console.log('Remote tree:', remoteTree.value?.model);

  processTrees();
}

const processTrees = async () => {
  const uploadDiff = getTreeDiff(localTree.value, remoteTree.value);
  console.log('Upload diff:', uploadDiff);
  state.messages.push('Syncing...');
  await uploadFiles(uploadDiff);
  //storeLocalTree();
  state.messages.push('Synced');
}

const getTreeDiff = (tree1:FileTreeModel, tree2:FileTreeModel) => {
  return tree1; // TODO
}

const uploadFiles = async (diff:FileTreeModel) => {
  const r = await getObjects('/');
  if (r.files.length === 0) {
    await createFolder('', '');
  }
  await createFolder('/', '.sync');

  diff?.walk((node) => {
    if (node.model.type === 'directory') {
      console.log('Dir:', node.model);
      createFolder('/.sync', node.model.path);
      state.messages.push(`Folder: ${node.model.path}`);
    } else if (node.model.type === 'file') {
      console.log('File:', node.model);
      state.messages.push(`Uploading file: ${node.model.path}`);
    }
    return true;
  });
}

const storeLocalTree = async () => {
  const token = user.value?.token;
  const body = encodeArrayBufferToUrlSafeBase64(new TextEncoder().encode(JSON.stringify(localTree.value)).buffer);
  const r = await fetch(`${CONFIG.API_HOST}/api/sync/tree`, {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tree: body }),
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

</script>

<template>
  <div class="test">
    <div class="directory" v-if="state.directory"><a href="#" @click="openDirectory">{{ state.directory }}</a></div>
    <div class="directory" v-else>Directory not selected</div>
    <div class="actions">
      <div class="action">
        <a target="_blank" rel="noreferrer" @click="chooseDirectory">Choose directory</a>
      </div>
      <div class="action" v-if="false && state.directory">
        <a target="_blank" rel="noreferrer" @click="readFile">Test local file read/write</a>
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
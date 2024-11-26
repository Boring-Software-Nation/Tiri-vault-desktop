<script setup lang="ts">
import { reactive } from 'vue';

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

window.electron.ipcRenderer.on('filetree', (event, filetree) => {
  console.log('Filetree:', filetree);
  //state.messages.push(`Filetree: ${JSON.stringify(filetree)}`);
})
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
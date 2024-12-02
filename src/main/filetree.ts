import crypto from 'crypto';
import { createReadStream } from 'fs';
import { stat, readdir } from 'fs/promises';
import * as path from 'path';
import TreeModel from 'tree-model';
import { log, sendMessage } from './common';

const treeModel = new TreeModel();
let readingDirectory = false;
let stopReading = false;
let fileTreeReady = false;

function filetree(rootPath: string) {
  const result = {
    files: 0,
    tree: null as Promise<any>|null
  };

  const buildNode = async (nodePath: string): Promise<any> => {
    if (stopReading) {
      return;
    }
    const stats = await stat(nodePath);
    if (stats.isDirectory()) {
      const children = await readdir(nodePath);
      const p = path.relative(rootPath, nodePath);
      return {
        name: p ? path.basename(nodePath) : "/",
        path: p,
        type: "directory",
        mtime: stats.mtimeMs,
        children: await Promise.all(children.map(async (child) => buildNode(path.join(nodePath, child)))),
      };
    } else {
      result.files++;
      return { name: path.basename(nodePath), path: path.relative(rootPath, nodePath), type: "file", mtime: stats.mtimeMs };
    }
  }

  result.tree = buildNode(rootPath);

  return result;
}

type FileTreeNode = {
  name: string,
  path: string,
  type: 'file'|'directory',
  mtime: number,
  hash?: string,
  children?: FileTreeNode[]
}

let tree:TreeModel.Node<FileTreeNode>|null = null;

export async function readDirectory(directory: string) {
  if (readingDirectory) {
    await stopReadingDirectory();
  }
  fileTreeReady = false;
  readingDirectory = true;

  let result;
  let lastMessage = '';
  sendMessage('addMessage', `Reading directory ${directory}`);

  let interval = setInterval(() => {
    let newMessage = `Reading directory, ${result?.files||0} files found...`;
    sendMessage('replaceMessage', newMessage, lastMessage);
    lastMessage = newMessage;
  }, 1000);

  result = filetree(directory);
  tree = treeModel.parse(await result.tree);

  clearInterval(interval);
  if(stopReading) {
    sendMessage('replaceMessage', 'Directory scan cancelled.', lastMessage);
    readingDirectory = false;
    return;
  }

  sendMessage('replaceMessage', `Directory scanned, ${result.files} files found.`, lastMessage);
  log('Directory scanned,', result.files, 'files found.');

  lastMessage = 'Reading files...';
  sendMessage('addMessage', lastMessage);
  let files = 0;

  interval = setInterval(() => {
    let newMessage = `Reading files... ${files} / ${result?.files||0}`;
    sendMessage('replaceMessage', newMessage, lastMessage);
    lastMessage = newMessage;
  }, 1000);

  const hashTasks = [] as (() => Promise<void>)[];

  tree.all((node) => { return node.model.type === 'file'}).forEach(async (node) => {
    hashTasks.push(async () => {
      files++;
      log('Reading file', node.model.path);
      node.model.hash = await calculateFileHash(path.join(directory, node.model.path));
      log(node.model.hash);
    })
  });

  await runSequentially(hashTasks);

  clearInterval(interval);

  if(stopReading) {
    sendMessage('replaceMessage', 'Files scan cancelled.', lastMessage);
    readingDirectory = false;
    return;
  }

  sendMessage('replaceMessage', "Files' checksums collected.", lastMessage);
  readingDirectory = false;

  fileTreeReady = true;
  sendMessage('filetree', tree.model);
}

async function calculateFileHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const fileStream = createReadStream(filePath);

    fileStream.on('data', (chunk) => {
      if (stopReading) {
        fileStream.destroy();
        resolve('');
      }
      hash.update(chunk);
    });

    fileStream.on('end', () => {
      resolve(hash.digest('hex')); // Output checksum in hexadecimal format
    });

    fileStream.on('error', (err) => {
      reject(err);
    });
  });
}

async function runSequentially(tasks: (() => Promise<any>)[]) {
  for (const task of tasks) {
    if (stopReading) {
      return;
    }
    await task();
  }
}

async function stopReadingDirectory() {
  stopReading = true;
  while (readingDirectory) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  stopReading = false;
}

export function isFileTreeReady() {
  return fileTreeReady;
}
export function getTree() {
  return fileTreeReady ? tree : null;
}

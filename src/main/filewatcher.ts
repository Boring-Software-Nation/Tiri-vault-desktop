import chokidar, { FSWatcher } from 'chokidar';
import { log } from './common';
import * as path from 'path';
import { read } from 'fs';
import { readDirectory } from './filetree';

let watcher: FSWatcher|null = null;
const processingPaths = new Set<string>();

export function addProcessingPath(p: string) {
  processingPaths.add(p);
}

export function startFileWatcher(directory: string) {
  if (watcher) {
    watcher.close();
  }

  watcher = chokidar.watch(directory, {
    ignored: (filepath, stats) => {
      const name = path.basename(filepath);
      return (stats||false) && stats.isFile() && name.endsWith('.tmp');
    },
    ignoreInitial: true,
    persistent: true
  });

  watcher.on('all', (event, filepath) => {
    log('file watcher:', event, filepath, processingPaths.has(filepath));
    if(processingPaths.has(filepath)) {
      processingPaths.delete(filepath);
      return;
    }
    readDirectory(directory);
  });
}

export async function stopFileWatcher() {
  if (watcher) {
    await watcher.close();
  }
}

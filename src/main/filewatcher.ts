import chokidar, { FSWatcher } from 'chokidar';
import { log } from './common';
import * as path from 'path';
import { read } from 'fs';
import { readDirectory } from './filetree';

let watcher: FSWatcher|null = null;
const processingPaths = new Map<string, number>();

export function addProcessingPath(p: string) {
  const count = processingPaths.get(p) || 0;
  processingPaths.set(p, count + 1);
}

export function startFileWatcher(directory: string) {
  if (watcher) {
    watcher.close();
  }

  watcher = chokidar.watch(directory, {
    ignored: (filepath, stats) => {
      const name = path.basename(filepath);
      return (stats||false) && stats.isFile() && (name.endsWith('.tmp') || name.startsWith('~'));
    },
    ignoreInitial: true,
    persistent: true
  });

  watcher.on('all', (event, filepath) => {
    const count = processingPaths.get(filepath) || 0;
    log('file watcher:', event, filepath, count);
    if(count == 0) {
      readDirectory(directory);
    } else if(count === 1) {
      processingPaths.delete(filepath);
    } else {
      processingPaths.set(filepath, count - 1);
    }
  });
}

export async function stopFileWatcher() {
  if (watcher) {
    await watcher.close();
  }
}

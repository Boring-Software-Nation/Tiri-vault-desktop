import { app, shell, dialog, BrowserWindow, ipcMain, nativeImage, Tray, Menu } from 'electron'
import { join, relative } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs';
import Store from 'electron-store';
import express from 'express';
import { log, sendMessage } from './common';
import { getTree, isFileTreeReady, readDirectory } from './filetree';
import tmp from 'tmp';
import { addProcessingPath } from './filewatcher';

const lock = app.requestSingleInstanceLock();

if (!lock || process.argv.includes('--quit')) {
  app.exit();
}

tmp.setGracefulCleanup();

const PORT = 5174;

if (!(is.dev && process.env['ELECTRON_RENDERER_URL'])) {
  const server = express();
  const dir = join(__dirname, '../renderer');
  //log('Serving static files from', dir);
  server.use(express.static(dir));
  server.listen(PORT);
}

type StoreType = {
  //syncDirectory?: string
  directories: { [key: string]: { path: string, synced: boolean } }
};

// is.dev = true; // FIXME: don't forget to remove this line for release build

const FILE_CHUNK_SIZE = 32 * 1024 * 1024;

const store = new Store<StoreType>({
  defaults: {
    directories: {}
  }
}) as any; // store typed as any to avoid TS error

let directory:string = ''; //store.get('syncDirectory')||'';
let currentWalletId:string = '';

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 640,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.removeMenu();

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    //mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    mainWindow.loadURL(`http://localhost:${PORT}/index.html`)
  }

  return mainWindow;
}

let quitTimeout:NodeJS.Timeout|null = null;

function quit() {
  sendMessage('quit');
  quitTimeout = setTimeout(() => {
    app.quit();
  }, 1500);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC handlers
  ipcMain.on('chooseDirectory', () => chooseDirectory())
  ipcMain.on('openDirectory', () => openDirectory())
  ipcMain.on('getDirectory', (event, walletId) => getDirectory(walletId));
  ipcMain.on('readFile', (event, id, fileName) => readFile(id, fileName))
  ipcMain.on('readNextChunk', (event, id, fd) => readNextChunk(id, fd))
  ipcMain.on('writeFile', (event, id, fileName, buffer, bytes, eof) => writeFile(id, fileName, buffer, bytes, eof))
  ipcMain.on('writeNextChunk', (event, id, fd, buffer, bytes, eof) => writeNextChunk(id, fd, buffer, bytes, eof))
  ipcMain.on('createDirectory', (event, path) => createDirectory(path))
  ipcMain.on('createTempFile', (event, path) => createTempFile(path))
  ipcMain.on('renameFile', (event, oldPath, newPath) => renameFile(oldPath, newPath))
  ipcMain.on('getFileTree', () => getFileTree())
  ipcMain.on('removeFile', (event, path) => removeFile(path))
  ipcMain.on('directorySynced', (event, walletId) => {
    store.set(`directories.${walletId}.synced`, true);
  });

  ipcMain.on('quit', () => {
    if (quitTimeout) {
      clearTimeout(quitTimeout);
      quitTimeout = null;
    }
    app.quit();
  });

  const mainWindow = createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  let isQuitting = false;

  const trayIcon = nativeImage.createFromPath(join(__dirname, '../../resources/icon.png'));
  const tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Tiri Vault Desktop',
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: 'Quit',
      click: () => {
        quit();
      },
    },
  ]);

  tray.setToolTip('Tiri Vault Desktop');
  tray.setContextMenu(contextMenu);

  // Minimize to tray when the window is closed
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault(); // Prevent the default close behavior
      mainWindow.hide(); // Hide the window instead of closing it
    }
  });

  // Show the window again when the tray icon is clicked
  tray.on('click', () => {
    mainWindow.show();
  });

  app.on('before-quit', () => {
    isQuitting = true;
  });

  app.on('second-instance', (event, argv) => {
    if (argv.includes('--quit')) {
      quit();
    } else if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

function getDirectory(walletId: string) {
  currentWalletId = walletId;
  const directoryItem = store.get('directories')[walletId];
  directory = directoryItem?.path || '';
  if (directory) {
    sendMessage('directorySelected', directory, directoryItem.synced);
    // if (isFileTreeReady())
    //   sendMessage('filetree', getTree()?.model)
    // else
    readDirectory(directory);
  }
}

function chooseDirectory() {
  dialog
    .showOpenDialog({
      properties: ['openDirectory']
    })
    .then((result: any) => {
      if (result.filePaths.length === 0) {
        return;
      }
      directory = result.filePaths[0];
      //store.set('syncDirectory', directory);
      store.set(`directories.${currentWalletId}`, { path: directory, synced: false });
      sendMessage('directorySelected', result.filePaths[0], false);
      readDirectory(directory);
    })
}

function getFileTree() {
  readDirectory(directory);
}

function openDirectory() {
  shell.openPath(directory);
}

function readFile(id: any, fileName: string) {
  fileName = fileName.replaceAll('..', ''); // simple safety sanitization, improve it as needed
  fs.open(directory + '/' + fileName, 'r', (err: any, fd: any) => {
    if (err) {
      sendMessage('chunkRead', id, null);
      return;
    }
    const buffer = Buffer.alloc(FILE_CHUNK_SIZE);
    fs.read(fd, buffer, (err: any, bytesRead: any, buffer: any) => {
      if (err) {
        sendMessage('chunkRead', id, null);
        fs.close(fd, () => {});
        return;
      }
      const eof = bytesRead === 0 || bytesRead < FILE_CHUNK_SIZE;
      sendMessage('chunkRead', id, fd, buffer, bytesRead, eof);
      if (eof) {
        fs.close(fd, () => {});
      }
    });
  });
}

function readNextChunk(id: any, fd: any) {
  const buffer = Buffer.alloc(FILE_CHUNK_SIZE);
  fs.read(fd, buffer, (err: any, bytesRead: any, buffer: any) => {
    if (err) {
      sendMessage('chunkRead', id, null);
      fs.close(fd, () => {});
      return;
    }
    const eof = bytesRead === 0 || bytesRead < FILE_CHUNK_SIZE;
    sendMessage('chunkRead', id, fd, buffer, bytesRead, eof);
    if (eof) {
      fs.close(fd, () => {});
    }
  });
}

function writeFile(id: any, fileName: string, buffer: any, bytes, eof) {
  fileName = fileName.replaceAll('..', ''); // simple safety sanitization, improve it as needed
  const fullpath = join(directory, fileName);
  addProcessingPath(fullpath);
  fs.open(fullpath, 'w', (err: any, fd: any) => {
    if (err) {
      sendMessage('chunkWritten', id, null);
      return;
    }
    fs.write(fd, buffer, 0, bytes, (err: any, written: any, buffer: any) => {
      if (err) {
        sendMessage('chunkWritten', id, null);
        fs.close(fd, () => {});
        return;
      }
      if (eof) {
        fs.close(fd, () => {});
      }
      sendMessage('chunkWritten', id, fd, written, eof);
    });
  });
}

function writeNextChunk(id: any, fd: any, buffer: any, bytes, eof) {
  //log('writeNextChunk', fd, bytes, eof);
  fs.write(fd, buffer, 0, bytes, (err: any, written: any, buffer: any) => {
    if (err) {
      sendMessage('chunkWritten', id, null);
      fs.close(fd, () => {});
      return;
    }
    if (eof) {
      fs.close(fd, () => {});
    }
    sendMessage('chunkWritten', id, fd, written, eof);
  });
}

function createDirectory(path: string) {
  path = path.replaceAll('..', ''); // simple safety sanitization, improve it as needed
  const fullpath = join(directory, path);
  addProcessingPath(fullpath);
  fs.mkdir(fullpath, { recursive: true },  (err: any) => {
    if (err) {
      sendMessage('mkdir', path, false);
      return;
    }
    sendMessage('mkdir', path, true);
  });
}

function createTempFile(dir: string) {
  dir = dir.replaceAll('..', ''); // simple safety sanitization, improve it as needed
  tmp.file({ tmpdir: directory, dir: dir, prefix: 'tdvdl-', postfix: '.tmp' }, (err, path, fd) => {
    if (err) {
      log('Error creating temp file:', err);
    } else
      log('TempFile created: ', path, fd);
    sendMessage('tempFileCreated', err, relative(directory, path), fd);
  });
}

function renameFile(oldPath: string, newPath: string) {
  oldPath = oldPath.replaceAll('..', ''); // simple safety sanitization, improve it as needed
  newPath = newPath.replaceAll('..', ''); // simple safety sanitization, improve it as needed
  const oldPathFull = join(directory, oldPath);
  const newPathFull = join(directory, newPath);
  addProcessingPath(newPathFull);
  fs.rename(oldPathFull, newPathFull, (err: any) => {
    if (err) {
      log('Error renaming file:', err, oldPath, newPath);
    }
    sendMessage('fileRenamed', err, oldPath, newPath);
  });
}

function removeFile(path: string) {
  path = path.replaceAll('..', ''); // simple safety sanitization, improve it as needed
  const fullpath = join(directory, path);
  addProcessingPath(fullpath);
  fs.rm(fullpath, { recursive: true, force: true }, (err: any) => {
    if (err) {
      sendMessage('fileRemoved', path, false);
      return;
    }
    sendMessage('fileRemoved', path, true);
  });
}

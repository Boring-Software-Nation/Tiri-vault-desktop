import { app, shell, dialog, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs';
import Store from 'electron-store';

type StoreType = {
  syncDirectory?: string
};

const FILE_CHUNK_SIZE = 4096;

const store = new Store<StoreType>() as any; // store typed as any to avoid TS error

let directory:string = store.get('syncDirectory')||'';

function createWindow(): void {
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
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
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

  // IPC test
  ipcMain.on('chooseDirectory', () => chooseDirectory())
  ipcMain.on('openDirectory', () => openDirectory())
  ipcMain.on('getDirectory', () => BrowserWindow.getAllWindows()[0].webContents.send('directorySelected', directory));
  ipcMain.on('readFile', (event, fileName) => readFile(fileName))
  ipcMain.on('readNextChunk', (event, fd) => readNextChunk(fd))
  ipcMain.on('writeFile', (event, fileName, buffer, bytes, eof) => writeFile(fileName, buffer, bytes, eof))
  ipcMain.on('writeNextChunk', (event, fd, buffer, bytes, eof) => writeNextChunk(fd, buffer, bytes, eof))

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

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
      store.set('syncDirectory', directory);
      BrowserWindow.getAllWindows()[0].webContents.send('directorySelected', result.filePaths[0]);
    })
}

function openDirectory() {
  shell.openPath(directory);
}

function readFile(fileName: string) {
  fileName.replaceAll('..', ''); // simple safety sanitization, improve it as needed
  fs.open(directory + '/' + fileName, 'r', (err: any, fd: any) => {
    if (err) {
      BrowserWindow.getAllWindows()[0].webContents.send('chunkRead', null);
      return;
    }
    const buffer = Buffer.alloc(FILE_CHUNK_SIZE);
    fs.read(fd, buffer, (err: any, bytesRead: any, buffer: any) => {
      if (err) {
        BrowserWindow.getAllWindows()[0].webContents.send('chunkRead', null);
        fs.close(fd, () => {});
        return;
      }
      const eof = bytesRead === 0 || bytesRead < FILE_CHUNK_SIZE;
      BrowserWindow.getAllWindows()[0].webContents.send('chunkRead', fd, buffer, bytesRead, eof);
      if (eof) {
        fs.close(fd, () => {});
      }
    });
  });
}

function readNextChunk(fd: any) {
  const buffer = Buffer.alloc(FILE_CHUNK_SIZE);
  fs.read(fd, buffer, (err: any, bytesRead: any, buffer: any) => {
    if (err) {
      BrowserWindow.getAllWindows()[0].webContents.send('chunkRead', null);
      fs.close(fd, () => {});
      return;
    }
    const eof = bytesRead === 0 || bytesRead < FILE_CHUNK_SIZE;
    BrowserWindow.getAllWindows()[0].webContents.send('chunkRead', fd, buffer, bytesRead, eof);
    if (eof) {
      fs.close(fd, () => {});
    }
  });
}

function writeFile(fileName: string, buffer: any, bytes, eof) {
  fileName.replaceAll('..', ''); // simple safety sanitization, improve it as needed
  fs.open(directory + '/' + fileName, 'w', (err: any, fd: any) => {
    if (err) {
      BrowserWindow.getAllWindows()[0].webContents.send('chunkWritten', null);
      return;
    }
    fs.write(fd, buffer, 0, bytes, (err: any, written: any, buffer: any) => {
      if (err) {
        BrowserWindow.getAllWindows()[0].webContents.send('chunkWritten', null);
        fs.close(fd, () => {});
        return;
      }
      if (eof) {
        fs.close(fd, () => {});
      }
      BrowserWindow.getAllWindows()[0].webContents.send('chunkWritten', fd, written, eof);
    });
  });
}

function writeNextChunk(fd: any, buffer: any, bytes, eof) {
  //console.log('writeNextChunk', fd, bytes, eof);
  fs.write(fd, buffer, 0, bytes, (err: any, written: any, buffer: any) => {
    if (err) {
      BrowserWindow.getAllWindows()[0].webContents.send('chunkWritten', null);
      fs.close(fd, () => {});
      return;
    }
    if (eof) {
      fs.close(fd, () => {});
    }
    BrowserWindow.getAllWindows()[0].webContents.send('chunkWritten', fd, written, eof);
  });
}

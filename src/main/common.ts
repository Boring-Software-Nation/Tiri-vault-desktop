import { is } from "@electron-toolkit/utils";
import { BrowserWindow } from "electron";

export function log(...args: any[]) {
  if(is.dev)
    console.log(...args);
}

export function sendMessage(channel: string, ...args: any[]) {
  BrowserWindow.getAllWindows()[0].webContents.send(channel, ...args);
}

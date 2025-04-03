/**
 * Exposes function call to global object 'window' in renderer process
 */

import { contextBridge, ipcRenderer } from "electron";
import { store } from "./utilities/store-utility";

contextBridge.exposeInMainWorld("electron", {
  invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  on: (channel: string, callback: (...args: any) => void) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
  onVideo: (callback: (data: any) => void) => {
    ipcRenderer.on("video", (event, data) => {
      callback(data);
    });
  },
  onStream: (callback: (frame: any) => void) =>
    ipcRenderer.on("liveview", (_, frame) => callback(frame)),

  onStateUpdate: (callback: (state: any) => void) =>
    ipcRenderer.on("state-update", (_, state) => callback(state)),
  testError: () => {
    throw new Error("This is a test error");
  },
});

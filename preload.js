/**
 * Exposes function call to global object 'window' in renderer process
 */

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
  onVideo: (callback) => {
    ipcRenderer.on("video", (event, data) => {
      callback(data);
    });
  },
  onStream: (callback) =>
    ipcRenderer.on("stream", (_, frame) => callback(frame)),
});

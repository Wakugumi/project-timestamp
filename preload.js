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

  sendReduxState: (state) => ipcRenderer.send("redux-state-update", state),
  onStateUpdate: (callback) =>
    ipcRenderer.on("state-update", (_, state) => callback(state)),

  testError: () => ipcRenderer.send("session/throw", {}),
  testFallback: () => ipcRenderer.invoke("main/fallback"),
});

contextBridge.exposeInMainWorld("config", {
  BOOTH_TOKEN: process.env.BOOTH_TOKEN,
});

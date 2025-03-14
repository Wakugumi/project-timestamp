const { ipcMain } = require("electron");
const { IPCResponse } = require("../interface/ipcResponseInterface");
const File = require("../services/FileService");
const { startUpload } = require("../services/UploadService");
const state = require("../helpers/StateManager.js");
const api = require("../services/APIService.js");

ipcMain.handle("session/reset", async (event, data) => {
  try {
    await File.resetSession();
    return IPCResponse.ok("Session has been reset");
  } catch (error) {
    return IPCResponse.error(error);
  }
});

ipcMain.handle("session/get", async (event, data) => {
  try {
    const paths = File.getCaptures();
    if (paths.length <= 0)
      return IPCResponse.failed("no capture file is found", paths);
    return IPCResponse.ok("captures found", paths);
  } catch (error) {
    return IPCResponse.error(error);
  }
});

ipcMain.handle("session/process", async (event, data) => {
  /** @type {import('./APIService.js').UploadResponse} */
  const url = await api.upload(data.count);

  startUpload(data.count, data.urls, url);
  const respond = `https://timestamp.fun/views/${url.id}`;
  return IPCResponse.ok("fetches result url", respond);
});

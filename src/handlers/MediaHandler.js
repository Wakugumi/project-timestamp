const { ipcMain } = require("electron");
const { IPCResponse } = require("../interface/ipcResponseInterface");
const Media = require("../services/MediaService.js");

ipcMain.on("media/save", async (event, dataUrl) => {
  try {
    await Media.saveCanvas(dataUrl);
    return IPCResponse.ok();
  } catch (error) {
    return IPCResponse.failed(error);
  }
});

ipcMain.on("media/print", async (event, dataUrl) => {
  try {
    await Media.savePrint(dataUrl);
    return IPCResponse.ok();
  } catch (error) {
    return IPCResponse.failed(error);
  }
});

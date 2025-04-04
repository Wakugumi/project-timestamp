const { ipcMain } = require("electron");
const { IPCResponse } = require("../interfaces/ipcResponseInterface");
const Media = require("../services/MediaService.js");

ipcMain.handle("media/save", async (event, dataUrl) => {
  try {
    await Media.saveCanvas(dataUrl);
    return IPCResponse.ok();
  } catch (error) {
    return IPCResponse.failed(error);
  }
});

ipcMain.handle("media/print", async (event, data) => {
  try {
    const path = await Media.savePrint(data.data);
    console.log("printing", path);
    Media.print(path, data.quantity, data.split);
    return IPCResponse.ok();
  } catch (error) {
    return IPCResponse.failed(error);
  }
});

ipcMain.handle("media/motion", async (event, dataUrl) => {
  try {
    Media.saveMotion(dataUrl);
    return IPCResponse.ok();
  } catch (error) {
    return IPCResponse.error(error);
  }
});

const { ipcMain } = require("electron");
const { IPCResponse } = require("../interfaces/ipcResponseInterface");
const Media = require("../services/MediaService.js");
const File = require("../services/FileService.js");
const { logger } = require("../utility/logger.js");

exports.registerMediaHandlers = () => {
  ipcMain.handle("media/canvas", async (event, dataUrl) => {
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

  ipcMain.handle("media/captures", async () => {
    try {
      const paths = File.getCaptures();
      if (paths.length <= 0)
        return IPCResponse.failed("no capture file is found", paths);
      return IPCResponse.ok("captures found", paths);
    } catch (error) {
      return IPCResponse.error(error);
    }
  });

  ipcMain.handle("media/render", async () => {
    try {
      Media.renderMotion();
      return IPCResponse.ok("starting rendering process");
    } catch (error) {
      logger.error(error);
      return IPCResponse.error(error);
    }
  });
};

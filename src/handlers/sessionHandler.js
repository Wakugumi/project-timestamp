const { ipcMain } = require("electron");
const { IPCResponse } = require("../interface/ipcResponseInterface");
const File = require("../services/FileService");

ipcMain.handle("session/reset", async (event, data) => {
  try {
    await File.resetSession();
    return IPCResponse.ok("Session has been reset");
  } catch (error) {
    return IPCResponse.error(error);
  }
});

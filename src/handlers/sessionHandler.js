const { ipcMain } = require("electron");
const { IPCResponse } = require("../interface/ipcResponseInterface");
const File = require("../services/FileService");
const { startUpload } = require("../services/UploadService");

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

ipcMain.on("session/upload", async (event, data) => {
  startUpload(data.count)
    .then((result) => {
      event.sender.send("upload-progress", result);
    })
    .catch((error) => {
      event.sender.send("upload-progress", {
        status: "error",
        message: err.message,
      });
    });
});

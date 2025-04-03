import { ipcMain } from "electron";
import { IPCResponse } from "../interfaces/IPCResponse";
import Camera from "../services/camera-service";
import { Logger } from "../utilities/logger-utility";

ipcMain.handle("camera/status", async () => {
  try {
    const status = await Camera.status();
    if (status) return IPCResponse.ok("camera status available");
    else return IPCResponse.failed("camera is unavailable");
  } catch (error) {
    Logger.error(error);
    return IPCResponse.error(error);
  }
});

ipcMain.handle("camera/capture", async () => {
  try {
    await Camera.capture();
    return IPCResponse.ok("capture triggered");
  } catch (error) {
    return IPCResponse.error(error);
  }
});

ipcMain.handle("camera/checkup", async () => {
  try {
    await Camera.checkup();
    return IPCResponse.ok("camera checkup complete");
  } catch (error) {
    Logger.error(error);
    return IPCResponse.error(error);
  }
});

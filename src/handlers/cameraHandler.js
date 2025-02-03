const { ipcMain } = require("electron");

/**
 * Device service class
 */
const device = require("../services/DeviceService");
/** IPC IPCResponse interface */
const { IPCResponse } = require("../interface/ipcResponseInterface");

ipcMain.handle("camera/boot", async (event, data) => {
  try {
    await device.bootup();
    return IPCResponse.ok("Camera bootup resolved");
  } catch (error) {
    return IPCResponse.error(error);
  }
});

ipcMain.handle("camera/status", async (event, data) => {
  try {
    const status = await device.check();

    if (status) return IPCResponse.ok("Camera is available");
    else return IPCResponse.failed("Camera is unavailable");
  } catch (error) {
    return IPCResponse.error(error);
  }
});

ipcMain.handle("camera/capture", async (event, data) => {
  try {
    await device.capture();
    return IPCResponse.ok("Capture success");
  } catch (error) {
    return IPCResponse.error(error);
  }
});

ipcMain.handle("camera/checkup", async (event, data) => {
  try {
    await device.checkup();
    return IPCResponse.ok("Checkup complete with no errors");
  } catch (error) {
    return IPCResponse.error(error);
  }
});

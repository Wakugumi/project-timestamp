import { ipcMain } from "electron";
import { IPCResponse } from "../interfaces/IPCResponse";
import Media from "../services/media-service";

interface media_print {
  data: any;
  quantity: number;
  split: boolean;
}
ipcMain.handle("media/print", async (event, data: media_print) => {
  try {
    await Media.print(data.data, data.quantity, data.split);

    return IPCResponse.ok("print task is sent");
  } catch (error) {
    console.error(error);
    return IPCResponse.error(error);
  }
});

ipcMain.handle("media/render", async (event) => {
  try {
    Media.renderMotion();
    return IPCResponse.ok("rendering task is sent");
  } catch (error) {
    console.error(error);
    return IPCResponse.error(error);
  }
});

ipcMain.handle("media/motion", async (event, data) => {
  try {
    await Media.saveMotion(data);
    return IPCResponse.ok("motion is saved");
  } catch (error) {
    console.error(error);
    return IPCResponse.error(error);
  }
});

ipcMain.handle("media/canvas", async (event, data) => {
  try {
    await Media.saveCanvas(data);
    return IPCResponse.ok("canvas is saved");
  } catch (error) {
    console.error(error);
    return IPCResponse.error(error);
  }
});

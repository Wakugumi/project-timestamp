import FileService from "./file-service";
import { BrowserWindow, ipcMain } from "electron/main";
import { CameraDriver } from "../drivers/camera-driver";
import { WebSocketServer } from "ws";

export default function LiveviewService(window: BrowserWindow) {
  const wss = new WebSocketServer({ port: 8080 });
  const camera = new CameraDriver(FileService.captureDir);

  console.log("start liveview service");
  let i = 1;
  wss.on("connection", (ws) => {
    console.log("Connection establsihed");
    let buffer = Buffer.alloc(0);

    camera.start_liveview((chunk) => {
      let chunkes = Buffer.from(chunk);
      buffer = Buffer.concat([buffer, chunkes]);
      window.webContents.send("liveview", buffer);
    });
    ws.on("close", async () => {
      await camera.stop_liveview();
    });
  });

  wss.on("error", (err) => {
    console.error(err);
    throw err;
  });
}

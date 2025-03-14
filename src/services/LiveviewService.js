const { WebSocketServer } = require("ws");
const CameraBackend = require("./backends/camera");
const { ipcMain } = require("electron/main");
const { ipcRenderer, BrowserWindow } = require("electron");
const logger = require("../utility/logger");

exports.start = (window) => {
  const wss = new WebSocketServer({ port: 8080 });

  wss.on("connection", async (ws) => {
    console.log("New connection established");
    wss.on("listening", () => {
      logger.trace("Web socket is listening");
    });
    let buffer = Buffer.alloc(0);

    try {
      CameraBackend._start_stream((chunk) => {
        buffer = Buffer.concat([buffer, chunk]);

        if (buffer.includes(Buffer.from([0xff, 0xd9]))) {
          window.webContents.send("stream", buffer);
          buffer = Buffer.alloc(0);
        }
      });
    } catch (error) {
      console.error(error);
      logger.error(error);
    }

    wss.on("error", (err) => {
      console.error(error);
      logger.error(err);
    });

    ws.on("close", async () => {
      console.log("A connection is closed");
      await CameraBackend._stop_stream();
    });
  });
};

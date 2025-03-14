const { app, BrowserWindow, MessageChannelMain } = require("electron");
const path = require("path");
const dotenv = require("dotenv");
const { URL } = require("url");
const { WebSocketServer } = require("ws");

const CameraBackend = require("./src/services/backends/camera.js");
const { default: logger } = require("./src/utility/logger.js");
dotenv.config();

const isDev = process.env.NODE_ENV === "development";

/**
 * @type {BrowserWindow}
 */
let window = null;

require("./src/handlers/CameraHandler.js");
require("./src/handlers/SessionHandler.js");
require("./src/handlers/MediaHandler.js");

app
  .whenReady()
  .then(() => {
    window = new BrowserWindow({
      width: 1280,
      height: 720,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        enableRemoteModule: false,
        nodeIntegration: false,
        allowRunningInsecureContent: true,
        webSecurity: false,
      },
    });

    window.maximize();

    if (isDev) window.loadURL("http://localhost:5173");
    else window.loadFile("dist/index.html");

    window.webContents.on("will-navigate", (event, url) => {
      const parsedUrl = new URL(url);
      const isFinish = parsedUrl.searchParams.has("transaction_status");

      if (isFinish) {
        event.preventDefault();
        const queryParams = Object.fromEntries(
          parsedUrl.searchParams.entries(),
        );
        window.webContents.send("payment", queryParams);
      }
    });

    const { port1, port2 } = new MessageChannelMain();

    window.webContents.once("did-finish-load", () => {
      window.webContents.postMessage("video", null, [port2]);
      (async () => {
        const contextMenu = await import("electron-context-menu");
        contextMenu.default({
          showCopyLink: true,
          showCopyImageAddress: true,
        });
      })();
    });

    /** Handles incoming connection
     * This opens streaming process from camera and process while sending with Electron IPC.
     */
    require("./src/services/LiveviewService.js").start(window);

    // Handles close call from window system
    window.on("closed", () => {
      window = null;
    });
  })
  .catch((error) => {
    logger.error(error);
  });

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

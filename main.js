const { app, BrowserWindow, MessageChannelMain, session } = require("electron");
const path = require("path");
const dotenv = require("dotenv");

const { logger } = require("./src/utility/logger.js");
const PaymentCallback = require("./src/handlers/PaymentCallback.js");
const { autoUpdater } = require("electron-updater");
const { crashReport } = require("./src/services/CrashReporter.js");
dotenv.config();

const isDev = process.env.NODE_ENV === "development";

/**
 * @type {BrowserWindow}
 */
let window = null;

/**
 * @type {BrowserWindow}
 */
let debugWindow = null;
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

    require("./src/handlers/MainHandler.js").registerMainHandlers(window);
    require("./src/handlers/CameraHandler.js").registerCameraHandlers();
    require("./src/handlers/SessionHandler.js").registerSessionHandlers();
    require("./src/handlers/MediaHandler.js").registerMediaHandlers();

    /** Handles incoming connection
     * This opens streaming process from camera and process while sending with Electron IPC.
     */
    require("./src/services/LiveviewService.js").start(window);

    if (isDev) window.loadURL("http://localhost:5173");
    else window.loadFile("build/index.html");

    window.maximize();
    window.setFullScreen(true);

    window.webContents.on("will-navigate", (event, url) => {
      PaymentCallback(event, url, (queryParams) => {
        window.webContents.send("payment", queryParams);
      });
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

    session.defaultSession.on("will-download", (event) => {
      event.preventDefault();
    });
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

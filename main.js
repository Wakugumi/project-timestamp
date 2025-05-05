const { app, BrowserWindow, MessageChannelMain, session } = require("electron");
const path = require("path");
const dotenv = require("dotenv");

const { logger } = require("./src/utility/logger.js");
const PaymentCallback = require("./src/handlers/PaymentCallback.js");
const { autoUpdater } = require("electron-updater");
const { crashReporter } = require("electron/common");
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

    const serverUpdater = "https://update.electron.build";
    const feedUpdater = `${serverUpdater}/owner/repo/${process.platform}-${process.arch}/${app.getVersion()}`;
    let isUpdateDownloaded = false;

    autoUpdater.autoRunAppAfterInstall = true;
    autoUpdater.autoDownload = true;
    autoUpdater.setFeedURL({ url: feedUpdater });
    autoUpdater.checkForUpdates();
    autoUpdater.on("update-downloaded", () => {
      isUpdateDownloaded = true;
    });

    window.maximize();
    window.setFullScreen(true);

    if (isDev) window.loadURL("http://localhost:5173");
    else window.loadFile(path.join(__dirname, "dist/index.html"));

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

    // Called from renderer after session ends
    ipcMain.handle("main/update", async () => {
      try {
        autoUpdater.autoRunAppAfterInstall = true;
        autoUpdater.autoDownload = true;

        const checkResult = await autoUpdater.checkForUpdates();
        if (
          checkResult?.updateInfo?.version !==
          autoUpdater.currentVersion.version
        ) {
          await autoUpdater.downloadUpdate();
          autoUpdater.quitAndInstall(true, true);
          return { updated: true };
        } else {
          return { updated: false };
        }
      } catch (error) {
        logger.error("Cannot update app", error);
        crashReport("update failed", error);
        window.loadFile(
          path.join(__dirname, "./renderer/fallbacks/update-failed.html"),
        );
        return { updated: false, error: err };
      }
    });

    /** Handles incoming connection
     * This opens streaming process from camera and process while sending with Electron IPC.
     */
    require("./src/services/LiveviewService.js").start(window);

    ipcMain.handle("main/reload", () => {
      logger.info("calling reload on window with ignoring cache");
      window.webContents.reload();
    });

    ipcMain.handle("main/fallback", () => {
      window.loadFile(path.join(__dirname, "src/renderers/fallback.html"));
      logger.error(
        "main process fallback called, app is currently on danger state",
      );
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

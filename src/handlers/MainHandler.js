const { ipcMain } = require("electron/main");
const { crashReport } = require("../services/CrashReporter");
const { logger } = require("../utility/logger");
const path = require("path");
const { autoUpdater } = require("electron-updater");

exports.registerMainHandlers = (window) => {
  ipcMain.handle("main/update", async () => {
    try {
      autoUpdater.autoRunAppAfterInstall = true;
      autoUpdater.autoDownload = true;

      const checkResult = await autoUpdater.checkForUpdates();
      if (
        checkResult?.updateInfo?.version !==
          autoUpdater.currentVersion.version &&
        checkResult
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
        path.join(__dirname, "../../renderer/fallbacks/update-failed.html"),
      );
      return { updated: false, error: error };
    }
  });
  ipcMain.handle("main/reload", async () => {
    logger.info("calling reload on window with ignoring cache");
    window.webContents.reload();
    return null;
  });

  ipcMain.handle("main/fallback", async () => {
    window.loadFile(
      path.join(__dirname, "../../renderer/fallbacks/error.html"),
    );
    logger.error(
      "main process fallback called, app is currently on danger state",
    );

    await crashReport("FATAL ERROR THROW");
    return null;
  });
};

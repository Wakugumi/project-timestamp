const { ipcMain } = require("electron");

const { IPCResponse } = require("../interfaces/ipcResponseInterface");
const File = require("../services/FileService");
const Media = require("../services/MediaService.js");
const { startUpload } = require("../services/UploadService");
const {
  store,
  nextPhase,
  resetSession,
  setPayment,
  setFrame,
  setCanvas,
  incrementReload,
  setPictures,
} = require("../helpers/SessionManager");
const api = require("../services/APIService.js");
const { logger } = require("../utility/logger.js");
const Payment = require("../services/PaymentService.js");
const { ipcRenderer } = require("electron");

ipcMain.handle("session/begin", async (event, data) => {
  await File.scanFolders();
  const state = store.getState().session;
  if (state.phase > 1) {
    const savedPhase = state.phase;
    logger.warn(`Rebooting app, current interrupted phase: ${savedPhase}`);
    return IPCResponse.ok("reload", state);
  }
  return IPCResponse.ok("normal", state);
});

ipcMain.handle("session/end", async (event, data) => {
  try {
    await File.resetSession();
    store.dispatch(resetSession());
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

ipcMain.handle("session/finalize", async (event, data) => {
  try {
    await Media.renderMotion();

    /** @type {import('./APIService.js').UploadResponse} */
    let url = await api.upload(data.count);
    let imageUrl = url.images;
    let videoUrl = url.video.url;

    let videoSrc = File.getExportDir() + "video.mp4";
    let imageSrc = data.urls;
    imageSrc.push(File.getExportDir() + "canvas.jpg");

    startUpload(data.urls, videoSrc, imageUrl, videoUrl);
    const respond = `https://timestamp.fun/views/${url.id}`;
    return IPCResponse.ok("fetches result url", respond);
  } catch (error) {
    console.error(error);
    return IPCResponse.error(error);
  }
});

ipcMain.handle("session/proceed", async (event, data) => {
  store.dispatch(nextPhase());
  return IPCResponse.ok();
});

ipcMain.handle("session/state/payment", async (event, data) => {
  store.dispatch(setPayment(data));
  return IPCResponse.ok();
});

ipcMain.handle("session/state/frame", async (event, data) => {
  store.dispatch(setFrame(data));
  return IPCResponse.ok();
});

ipcMain.handle("session/state/canvas", async (event, data) => {
  store.dispatch(setCanvas(data));
  return IPCResponse.ok();
});

ipcMain.handle("session/state/pictures", async (event, data) => {
  store.dispatch(setPictures(data));
});

ipcMain.handle("session/load", async () => {
  try {
    const object = store.getState().session;
    return IPCResponse.ok("load", object);
  } catch (error) {
    return IPCResponse.error(error);
  }
});

ipcMain.handle("session/throw", async () => {
  logger.warn("Throw from renderer");
  try {
    store.dispatch(incrementReload());
    if (store.getState().session.reload >= 3) {
      const payment = store.getState().session.payment;
      if (payment) {
        if (!payment.transaction_id) {
          const error = new Error(
            "Error handling session throw, exceed three times, payment occured but no transaction_id",
          );

          ipcRenderer.invoke("main/fallback");
          console.error(error);
          throw error;
        }
        await Payment.refund(payment.transaction_id);
        ipcRenderer.invoke("main/fallback/refund");
      }

      ipcRenderer.invoke("main/fallback");
      return IPCResponse.ok();
    } else {
      ipcRenderer.invoke("main/reload");
      console.log(store.getState().session);
    }
  } catch (error) {
    logger.error("Error handling session throw", error);
    ipcRenderer.invoke("main/fallback");
    return IPCResponse.error(error);
  }
});

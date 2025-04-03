const { ipcMain } = require("electron");
const { IPCResponse } = require("../interfaces/ipcResponseInterface");
const File = require("../services/FileService");
const Media = require("../services/MediaService.js");
const { startUpload } = require("../services/UploadService");
const {
  store,
  setPhase,
  nextPhase,
  resetSession,
  setPayment,
  setFrame,
  setCanvas,
} = require("../helpers/SessionManager");
const api = require("../services/APIService.js");
const { logger } = require("../utility/logger.js");

ipcMain.handle("session/start", async (event, data) => {
  if (store.getState().session.phase > 1) {
    const savedPhase = store.getState().session.phase;
    logger.warn(`Rebooting app, current interrupted phase: ${savedPhase}`);
    return IPCResponse.ok("reboot", { phase: savedPhase });
  }
  store.dispatch(setPhase(1));
  return IPCResponse.ok("normal", { phase: 1 });
});

ipcMain.handle("session/reset", async (event, data) => {
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

ipcMain.handle("session/process", async (event, data) => {
  console.log("session/prcess", data);
  try {
    await Media.renderMotion();

    /** @type {import('./APIService.js').UploadResponse} */
    let url = await api.upload(data.count);
    console.log("session/process url", url);
    let imageUrl = url.images;
    console.log("session/process imageurl", imageUrl);
    let videoUrl = url.video.url;

    console.log("session/process videourl", videoUrl);
    let videoSrc = File.getExportDir() + "video.mp4";
    let imageSrc = data.urls;
    imageSrc.push(File.getExportDir() + "canvas.jpg");
    console.log("session/process imageSrc", imageSrc);

    startUpload(data.urls, videoSrc, imageUrl, videoUrl);
    const respond = `https://timestamp.fun/views/${url.id}`;
    console.log(respond);
    return IPCResponse.ok("fetches result url", respond);
  } catch (error) {
    console.error(error);
    return IPCResponse.error(error);
  }
});

ipcMain.handle("session/next", async (event, data) => {
  store.dispatch(nextPhase());
  return IPCResponse.ok();
});

ipcMain.handle("session/payment", async (event, data) => {
  store.dispatch(setPayment(data));
  return IPCResponse.ok();
});

ipcMain.handle("session/frame", async (event, data) => {
  store.dispatch(setFrame(data));
  return IPCResponse.ok();
});

ipcMain.handle("session/canvas", async (event, data) => {
  store.dispatch(setCanvas(data));
  return IPCResponse.ok();
});

ipcMain.handle("session/load", async () => {
  try {
    const object = store.getState().session;
    return IPCResponse.ok("load", object);
  } catch (error) {
    return IPCResponse.error(error);
  }
});

import { ipcMain } from "electron";
import { IPCResponse, StatusCodes } from "../interfaces/IPCResponse";
import Session from "../services/session-service";

ipcMain.handle("session/begin", async (event) => {
  try {
    const state = await Session.begin();
    return IPCResponse.ok("new session initialized", state);
  } catch (error) {
    console.error(error);
    return IPCResponse.error(error);
  }
});

ipcMain.handle("session/proceed", async (event) => {
  try {
    await Session.proceed();
    return IPCResponse.ok("session proceed");
  } catch (error) {
    console.error(error);
    throw error;
  }
});

ipcMain.handle("session/end", async (event) => {
  try {
    await Session.end();
    return IPCResponse.ok("session ended");
  } catch (error) {
    console.error(error);
    return IPCResponse.error(error);
  }
});

ipcMain.handle("session/load", async (event) => {
  try {
    const state = await Session.load();
    return IPCResponse.ok("loading session", state);
  } catch (error) {
    console.error(error);
    return IPCResponse.error(error);
  }
});

ipcMain.handle("session/state/payment", async (event, data) => {
  try {
    await Session.payment(data);
    return IPCResponse.ok("transaction callback is saved");
  } catch (error) {
    console.error(error);
    return IPCResponse.error(error);
  }
});

ipcMain.handle("session/state/frame", async (event, data) => {
  try {
    await Session.setFrame(data);
    return IPCResponse.ok("frame is saved");
  } catch (error) {
    console.error(error);
    return IPCResponse.error(error);
  }
});

ipcMain.handle("session/throw", (event) => {
  Session.throw();
});

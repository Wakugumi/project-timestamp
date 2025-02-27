const { app, BrowserWindow, MessageChannelMain } = require("electron");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const route = require("./src/routes/indexRoute");
const bodyParser = require("body-parser");
const { URL } = require("url");
const { WebSocketServer } = require("ws");

const CameraBackend = require("./src/services/backends/camera.js");
const { ipcMain } = require("electron/main");
const { writeFileSync } = require("node:original-fs");

const { port1, port2 } = new MessageChannelMain();
dotenv.config();

const isDev = process.env.NODE_ENV === "development";

/**
 * @type {BrowserWindow}
 */
let window = null;

require("./src/handlers/cameraHandler.js");
require("./src/handlers/sessionHandler.js");

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

    const wss = new WebSocketServer({ port: 8080 });

    wss.on("connection", async (ws) => {
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
      }
      wss.on("error", (err) => {
        console.error(err);
      });
      ws.on("close", async () => {
        await CameraBackend._stop_stream();
      });
    });

    // Handles close call from window system
    window.on("closed", () => {
      window = null;
    });
  })
  .catch((error) => {
    console.error(error);
  });

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

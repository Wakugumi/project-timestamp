const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const route = require("./src/routes/indexRoute");
const bodyParser = require("body-parser");
const { URL } = require("url");

dotenv.config();

const isDev = process.env.NODE_ENV === "development";

let window;

require("./src/handlers/cameraHandler.js");
require("./src/handlers/sessionHandler.js");

const createWindow = () => {
  window = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
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
      const queryParams = Object.fromEntries(parsedUrl.searchParams.entries());
      window.webContents.send("payment", queryParams);
    }
  });
  // Handles close call from window system
  window.on("closed", () => {
    window = null;
  });
};

const startBackend = () => {
  const expressApp = express();
  const cors = require("cors");

  // Middlewares
  expressApp.use(cors());
  expressApp.use(bodyParser.json());
  expressApp.use(require("./src/middleware/responseInterceptor"));
  expressApp.use(require("./src/middleware/errorHandler"));

  expressApp.use("/v1", route);

  const server = expressApp.listen(3000, () => {
    console.log("App started at localhost, port ", 3000);
  });

  app.on("will-quit", () => {
    server.close();
  });
};

app.on("ready", () => {
  startBackend();

  (async () => {
    const contextMenu = await import("electron-context-menu");
    contextMenu.default({
      showCopyLink: true,
      showCopyImageAddress: true,
    });
  })()
    .then(() => {
      createWindow();
    })
    .catch((reason) => {
      console.error(reason);
    });
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const route = require("./src/routes/indexRoute");
const bodyParser = require("body-parser");

dotenv.config();

const isDev = process.env.NODE_ENV === "development";

let window;

require("./src/handlers/cameraHandler.js");
require("./src/handlers/sessionHandler.js");

const createWindow = () => {
  window = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  if (isDev) window.loadURL("http://localhost:5173");
  else window.loadFile("dist/index.html");

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
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

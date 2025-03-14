const fs = require("fs");
const path = require("path");
const fabric = require("fabric");
const { JSDOM } = require("jsdom");
const { app } = require("electron");
const { logger } = require("../utility/logger.js");
const File = require("./FileService.js");
const { window } = new JSDOM(`<!DOCTYPE html><p>Hello</p>`);
global.document = window.document;
global.window = window;
global.navigator = window.navigator;

exports.saveCanvas = async (url) => {
  const base64data = url.replace(/^data:image\/jpeg;base64,/, "");
  const buffer = Buffer.from(base64data, "base64");

  const savePath = File.getExportDir() + "canvas.jpg";

  fs.writeFile(savePath, buffer, (err) => {
    if (err) {
      logger.error(err);
      throw err;
    }
  });
};

exports.savePrint = async (url) => {
  const base64data = url.replace(/^data:image\/jpeg;base64,/, "");
  const buffer = Buffer.from(base64data, "base64");

  const savePath = File.getExportDir() + "print.jpg";

  fs.writeFile(savePath, buffer, (err) => {
    if (err) {
      logger.error(err);
      throw err;
    }
  });
};

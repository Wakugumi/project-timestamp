const fs = require("fs");
const { logger } = require("../utility/logger.js");
const File = require("./FileService.js");
const state = require("../helpers/StateManager.js");
const { spawn } = require("child_process");
const { once } = require("ws");

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

/**
 *
 * @param {string} url binary url for the image
 */
exports.saveMotion = async (url) => {
  if (!state.get("motion_index")) {
    state.set("motion_index", 1);
  }

  let index = state.get("motion_index");

  const base64data = url.replace(/^data:image\/jpeg;base64,/, "");
  const buffer = Buffer.from(base64data, "base64");

  const savePath =
    File.getMotionsDir() + (index < 10 ? `0${index}.jpg` : `${index}.jpg`);

  fs.writeFile(savePath, buffer, (err) => {
    if (err) {
      logger.error(err);
      throw err;
    }
    state.set("motion_index", index + 1);
  });
};

exports.print = async () => {};

exports.renderMotion = async () => {
  const path = File.getExportDir();
  const COMMAND = `ffmpeg -framerate 10 -i ./motions/%02d.jpg -vf "fps=10" -pix_fmt yuv420p ${path}video.mp4`;

  let process = spawn("bash", ["-c", COMMAND]);

  process.stdout.on("error", (err) => {
    logger.error(err);
    throw err;
  });

  await once(process, "close");
  console.log("video rendered");
  return `${path}video.mp4`;
};

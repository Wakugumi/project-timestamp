const fs = require("fs/promises");
const Logger = require("../utility/logger");
const path = require("path");
const CameraBackend = require("./backends/camera");
const { readdirSync, statSync } = require("fs");

const FOLDERPATH = {
  captures: process.cwd() + "/captures/",
  frames: process.cwd() + "/frames/",
  exports: process.cwd() + "/exports/",
};

/**
 * Returns a path for saving captured images
 * @returns {string}
 */
exports.getCaptureFolder = () => {
  return FOLDERPATH.captures;
};

exports.getExportDir = () => {
  return FOLDERPATH.exports;
};

exports.getExports = async () => {
  try {
    let files = [];
    readdirSync(path.resolve(FOLDERPATH.exports)).forEach((file) => {
      files.push(path.join(path.resolve(FOLDERPATH.exports), file));
    });
    return files;
  } catch (error) {
    throw error;
  }
};

/**
 * Returns array of captures location
 * @returns {string[]}
 */
exports.getCaptures = (filePaths = []) => {
  const absDir = path.resolve(FOLDERPATH.captures);
  const files = readdirSync(absDir);
  files.forEach((file) => {
    const filePath = path.join(absDir, file);
    filePaths.push(filePath);
  });

  return filePaths;
};

/**
 * Deletes all files related to session (Captures, Frame uploads)
 * @returns {Promise<void>}
 */
exports.resetSession = async () => {
  try {
    const files = await fs.readdir(FOLDERPATH.captures);
    if (!files.length) {
      Logger.warn("FILESYSTEM", "Session's directory are already empty");
      return;
    }
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(FOLDERPATH.captures, file);
        await fs.unlink(filePath);
      }),
    );
    CameraBackend._reset_file_index();
  } catch (error) {
    Logger.error(
      "FILESYSTEM",
      `Error resetting session folders: ${error.toString()}`,
    );
    throw error;
  }
};

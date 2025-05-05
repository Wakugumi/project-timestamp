const fs = require("fs/promises");
const { logger } = require("../utility/logger");
const path = require("path");
const CameraBackend = require("./backends/camera");
const { readdirSync, existsSync, mkdirSync } = require("fs");
const { app } = require("electron");

const FOLDERPATH = {
  captures: app.getPath("userData") + "/captures/",
  frames: app.getPath("userData") + "/frames/",
  exports: app.getPath("userData") + "/exports/",
  motions: app.getPath("userData") + "/motions/",
};

/**
 * Returns a path for saving captured images
 * @returns {string}
 */
exports.getCaptureFolder = () => {
  return FOLDERPATH.captures;
};

/**
 * Returns path for saving motions
 * @returns {string}
 */
exports.getMotionsDir = () => {
  return FOLDERPATH.motions;
};

exports.getExportDir = () => {
  return FOLDERPATH.exports;
};

exports.scanFolders = async () => {
  if (!existsSync(FOLDERPATH.captures)) mkdirSync(FOLDERPATH.captures);
  if (!existsSync(FOLDERPATH.frames)) mkdirSync(FOLDERPATH.frames);
  if (!existsSync(FOLDERPATH.motions)) mkdirSync(FOLDERPATH.motions);
  if (!existsSync(FOLDERPATH.exports)) mkdirSync(FOLDERPATH.exports);
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
    const captures = await fs.readdir(FOLDERPATH.captures);
    const exports = await fs.readdir(FOLDERPATH.exports);
    const motions = await fs.readdir(FOLDERPATH.motions);
    if (!captures.length || !exports.length || !motions.length) {
      logger.warn("FILESYSTEM", "Session's directory are already empty");
      return;
    }
    await Promise.all(
      captures.map(async (file) => {
        const filePath = path.join(FOLDERPATH.captures, file);
        await fs.unlink(filePath);
      }),
      exports.map(async (file) => {
        const filePath = path.join(FOLDERPATH.exports, file);
        await fs.unlink(filePath);
      }),
      motions.map(async (file) => {
        const filePath = path.join(FOLDERPATH.motions, file);
        await fs.unlink(filePath);
      }),
    );
    CameraBackend._reset_file_index();
  } catch (error) {
    logger.error(
      "FILESYSTEM",
      `Error resetting session folders: ${error.toString()}`,
    );
    throw error;
  }
};

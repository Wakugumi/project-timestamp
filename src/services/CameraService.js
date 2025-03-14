const { fstat, renameSync } = require("fs");
const Logger = require("../utility/logger");
const CameraBackend = require("./backends/camera");
const File = require("./FileService");
const { spawn } = require("child_process");

/** Bootsup the camera, essentially checking for its availability and active status
 * @returns {Promise<void>} Resolves when bootup succeeded, else thrown error
 */
exports.bootup = async () => {
  try {
    await CameraBackend._start();
  } catch (error) {
    throw error;
  }
};

/**
 * Checks camera status
 * If there are no device, it returns false instead of error
 * @returns {Promise<boolean>}
 */
exports.check = async () => {
  try {
    return await CameraBackend._status();
  } catch (error) {
    throw error;
  }
};

/**
 * Run capture process. This triggers camera capture and download the file immediately
 * @returns {Promise<string | void>} Resolves if the capture is successfuly saved as file by returning its file path
 */
exports.capture = async (testPath = null) => {
  const path = File.getCaptureFolder();
  try {
    if (CameraBackend.PROCESS_CAPTURE)
      throw new Error("Capture process is ongoing");
    if (testPath != null) {
      await CameraBackend._capture(testPath);
      CameraBackend._reset_file_index();
      return;
    }

    const resultPath = await CameraBackend._capture(path);
    return resultPath;
  } catch (error) {
    throw error;
  }
};

/**
 * Run a diagnostic test to ensure the camera main functions works
 * @returns {Promise<void>} Resolve when camera's malfunction is absent during diagnostic test, otherwise throw error
 */
exports.checkup = async () => {
  try {
    await CameraBackend._checkup();
    return;
  } catch (error) {
    throw error;
  }
};

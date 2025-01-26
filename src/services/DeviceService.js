const { fstat, renameSync } = require("fs");
const Logger = require("../utility/logger");
const CameraBackend = require("./backends/camera");
const File = require("./FileService");

exports.bootup = async () => {
  try {
    await cameraBackend._start();
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

    await CameraBackend._capture(path);
    return;
  } catch (error) {
    throw error;
  }
};

exports.checkup = async () => {
  try {
    await CameraBackend._checkup();
    return;
  } catch (error) {
    throw error;
  }
};

exports.startStream = async () => {
  try {
    await CameraBackend._start_liveview();
    return;
  } catch (error) {
    throw error;
  }
};

exports.stopStream = async () => {
  try {
    await CameraBackend._stop_liveview();
    return;
  } catch (error) {
    throw error;
  }
};

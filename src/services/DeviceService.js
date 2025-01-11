const { fstat, renameSync } = require('fs');
const Logger = require('../utility/logger');
const camera = require('./backends/camera');
const CameraBackend = require('./backends/camera');
const File = require('./FileService');

exports.bootup = async () => {
  try {
    await cameraBackend._start()
  } catch (error) {
    throw error
  }
}

/**
  * Checks camera status
  * If there are no device, it returns false instead of error
  * @returns {Promise<boolean>}
  */
exports.check = async () => {
  try {
    return await CameraBackend._status()
  } catch (error) {
    throw error;
  }
}

exports.capture = async (testPath = null) => {
  const path = File.getCaptureFolder();
  try {
    if (camera.PROCESS_CAPTURE) throw new Error('Capture process is ongoing');
    if (testPath != null) {
      await camera._capture(testPath);
      camera._reset_file_index();
      return;
    }

    await camera._capture(path);
  }

  catch (error) {
    throw error;
  }

}

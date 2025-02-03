const { fstat, renameSync } = require("fs");
const Logger = require("../utility/logger");
const CameraBackend = require("./backends/camera");
const File = require("./FileService");
const { spawn } = require("child_process");

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

exports.stopStream = async () => {
  try {
    await CameraBackend._stop_liveview();
    return;
  } catch (error) {
    throw error;
  }
};

exports.stream = (res) => {
  const gphoto = spawn("bash", ["-c", CameraBackend.COMMANDS.capture_movie]);
  gphoto.stderr.on("data", (data) => console.error(`GPhoto2 Error: ${data}`));

  const ffmpeg = spawn("bash", ["-c", CameraBackend.COMMANDS.stream]);

  gphoto.stdout.pipe(ffmpeg.stdin);
  ffmpeg.stdout.pipe(res);

  ffmpeg.stderr.on("data", (data) => console.error(`FFmpeg Error: ${data}`));

  gphoto.on("close", (code) => console.log(`gphoto2 exited with code ${code}`));
  ffmpeg.on("close", (code) => console.log(`FFmpeg exited with code ${code}`));

  return { gphoto, ffmpeg };
};

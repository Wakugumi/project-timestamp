const Logger = require("../../utility/logger");
const { spawn } = require("node:child_process");
const { once } = require("events");
const { existsSync, unlinkSync, readFile, statSync } = require("node:fs");
const { unlink } = require("node:fs/promises");

class CameraBackend {
  static PROCESS_CAPTURE = false;
  static PROCESS_LIVEVIEW = false;
  static DEVICE_READY = false;
  static FILE_INDEX = 1;
  static FOLDER_PATH = "";
  static TEST_FILE_PATH = process.cwd() + "/test-captures/" + "capture.jpg";

  static COMMANDS = {
    status: "gphoto2 --auto-detect",
    get capture() {
      return `gphoto2 --capture-image-and-download --filename ${CameraBackend.FOLDER_PATH}capture-${CameraBackend.FILE_INDEX}.jpg`;
    },

    get capture_movie() {
      return "gphoto2 --stdout --capture-movie";
    },

    get stream() {
      return "ffmpeg  -i - -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 -s:v 1920x1080 -r 25 /dev/video2";
    },

    get test_capture() {
      return `gphoto2 --capture-image-and-download --filename ${CameraBackend.TEST_FILE_PATH}`;
    },
  };

  /**
   * Check all current running program that are not multiprocess
   * @returns {boolean} - true if either one of the status is running
   */
  static _check_status() {
    if (this.PROCESS_LIVEVIEW || this.PROCESS_CAPTURE) return false;
    else return true;
  }

  /**
   * Async function to check the availability of camera device
   * @returns {Promise<boolean>} - true if the camera is readed by GPhoto2
   */
  static async _status() {
    let process = spawn("bash", ["-c", this.COMMANDS.status]);
    let output = "";
    let result = null;

    process.stdout.on("data", (data) => {
      output += data.toString();
    });
    process.stderr.on("data", (data) => {
      CameraBackend.DEVICE_READY = false;
      throw new Error(data);
    });

    process.on("close", (code) => {
      const lines = output.split("\n");
      // This is probably not an effective way to check, but it works since we assume devices that are read by GPhoto2 are cameras
      const cameraDetected = lines.some((line) => line.trim().includes("usb:"));
      result = cameraDetected;
    });

    // await for event close to finish
    await once(process, "close");
    if (result) {
      CameraBackend.DEVICE_READY = true;
    }
    return result;
  }

  /**
   * Async function to trigger camera capture function and await for file download
   * @returns {Promise<void>}
   * */
  static async _capture(folderPath) {
    if (!this._check_status()) {
      throw new Error("Device is busy");
    }

    if (!this.DEVICE_READY) {
      throw new Error("Device status is not yet determined");
    }
    if (!folderPath.endsWith("/")) {
      throw new Error(
        "folder path argument must specify a folder (ends with '/')",
      );
    }

    console.log("FILE INDEX: ", this.FILE_INDEX);

    // Set parameters
    this.FOLDER_PATH = folderPath;
    this.PROCESS_CAPTURE = true;

    let process = spawn("bash", ["-c", this.COMMANDS.capture]);

    process.on("error", (error) => {
      this.PROCESS_CAPTURE = false;
      throw new Error(error);
    });
    process.stderr.on("data", (data) => {
      this.PROCESS_CAPTURE = false;
      throw new Error(data.toString());
    });

    await once(process, "close");
    CameraBackend.FILE_INDEX += 1;
    this.PROCESS_CAPTURE = false;
    return;
  }

  /**
   * Reset File postfix numbering to 1.
   * CAUTION: please call this only when the capture folder is already cleared, otherwise it crash the program
   */
  static _reset_file_index() {
    CameraBackend.FILE_INDEX = 1;
  }

  static async _start_liveview() {
    if (this._check_status()) {
      throw new Error("Camera is busy");
    }
    if (!this.DEVICE_READY) {
      throw new Error(
        "Device status is not determined yet, please run status check first",
      );
    }

    this.PROCESS_LIVEVIEW = true;
    let gphoto = spawn("bash", ["-c", this.COMMANDS.capture_movie]);
    gphoto.on("error", (error) => {
      throw new Error(error.toString());
    });

    let ffmpeg = spawn("bash", [this.COMMANDS.stream]);
    ffmpeg.on("error", (error) => {
      throw new Error(error.toString());
    });

    gphoto.stdout.pipe(ffmpeg.stdin);

    gphoto.stderr.on("data", (data) => {
      throw new Error(data.toString());
    });

    ffmpeg.stderr.on("data", (data) => {
      throw new Error(data.toString());
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        throw new Error(`FFmpeg error : ${code}`);
      }
    });

    await once(ffmpeg, "close");
    return;
  }

  /**
   * Utilize for checking camera function availability
   * This will run capture test, stream test on the camera, also testing the program
   */
  static async _checkup() {
    if (!this.DEVICE_READY) {
      throw new Error("Device is not ready");
    }
    if (this.PROCESS_CAPTURE) {
      throw new Error("Capture process already ongoing");
    }
    let safe = true;

    this.PROCESS_CAPTURE = true;
    const capture = spawn("bash", ["-c", CameraBackend.COMMANDS.test_capture]);

    capture.stderr.on("data", (data) => {
      safe = false;
      this.PROCESS_CAPTURE = false;
      throw new Error(`Error running test capture command: ${data}`);
    });

    capture.on("error", (error) => {
      this.PROCESS_CAPTURE = false;
      throw new Error(`Camera checking error: ${error}`);
    });

    await once(capture, "close");
    this.PROCESS_CAPTURE = false;

    let exist = statSync(this.TEST_FILE_PATH);
    if (exist.size === 0) {
      safe = false;
      throw new Error("Capture checkup result unresolved");
    }

    unlinkSync(CameraBackend.TEST_FILE_PATH);

    if (safe) return;
    else throw new Error("Failed checkup");
  }
}

module.exports = CameraBackend;

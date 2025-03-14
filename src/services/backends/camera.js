const { spawn } = require("node:child_process");
const { once } = require("events");
const {
  existsSync,
  unlinkSync,
  readFile,
  statSync,
  readdirSync,
} = require("node:fs");
const { setTimeout } = require("node:timers");
const logger = require("../../utility/logger");
const { Semaphore } = require("../../helpers/Semaphore");

class CameraBackend {
  /**
   * @type {ChildProcess}
   * Act as instance for liveview child process
   */

  static PROCESS_CAPTURE = false;
  static PROCESS_LIVEVIEW = false;
  static DEVICE_READY = false;
  static FILE_INDEX = 1;
  static FOLDER_PATH = "";
  static TEST_FILE_PATH = process.cwd() + "/test-captures/" + "capture.jpg";

  static SEMAPHORE = new Semaphore(1);

  /**
   * @type {spawn}
   */
  static gphoto_process = null;

  static COMMANDS = {
    status: "gphoto2 --auto-detect",
    get capture() {
      return `gphoto2 --capture-image-and-download --filename ${CameraBackend.FOLDER_PATH}capture-${CameraBackend.FILE_INDEX}.jpg`;
    },

    get capture_movie() {
      return "gphoto2 --capture-movie --stdout";
    },

    get stream() {
      return "ffmpeg -i - -f mjpeg -s 1280x720 -q:v 3 -maxrate 4M -bufsize 2M -preset ultrafast -fflags nobuffer -vsync 0 -rtbufsize 2M -";
    },

    get test_capture() {
      return `gphoto2 --capture-image-and-download --filename ${CameraBackend.TEST_FILE_PATH}`;
    },
  };

  _execute(command) {
    this.SEMAPHORE.acquire();

    let process = spawn(command);

    process.on("error", (error) => {
      console.error(error);
      this.SEMAPHORE.release();
      return;
    });
    process.on("close", () => {
      this.SEMAPHORE.release();
    });
    return process;
  }

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
    await this.SEMAPHORE.acquire();

    let process = spawn("bash", ["-c", this.COMMANDS.status]);
    let output = "";
    let result = null;

    process.stdout.on("data", (data) => {
      output += data.toString();
    });
    process.stderr.on("data", (data) => {
      CameraBackend.DEVICE_READY = false;
      this.SEMAPHORE.release();
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
    this.SEMAPHORE.release();
    if (result) {
      CameraBackend.DEVICE_READY = true;
    }
    return result;
  }

  /**
   * Async function to trigger camera capture function and await for file download
   * @returns {Promise<void>}
   * */
  static async _capture(folderPath, i = 1) {
    if (!this._check_status()) {
      logger.warn(`Capturing failed, attempting to retry: attempt ${i}`);
      if (i < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // a second wait
        return this._capture(folderPath, i + 1);
      }
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

    // checks for existing
    try {
      const checkPath = `${folderPath}capture-${CameraBackend.FILE_INDEX}.jpg`;
      if (existsSync(checkPath)) unlinkSync(checkPath);
    } catch (error) {
      throw error;
    }

    // Set parameters
    this.FOLDER_PATH = folderPath;
    this.PROCESS_CAPTURE = true;

    await this.SEMAPHORE.acquire();

    let process = spawn("bash", ["-c", this.COMMANDS.capture]);

    process.on("error", (error) => {
      this.PROCESS_CAPTURE = false;
      this.SEMAPHORE.release();
      throw new Error(error);
    });
    process.stderr.on("data", (data) => {
      this.PROCESS_CAPTURE = false;
      this.SEMAPHORE.release();
      throw new Error(data.toString());
    });
    process.stderr.on("error", (err) => {
      this.PROCESS_CAPTURE = false;
      this.SEMAPHORE.release();
      throw err;
    });

    await once(process, "close");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.SEMAPHORE.release();
    CameraBackend.FILE_INDEX += 1;
    this.PROCESS_CAPTURE = false;
    return Promise.resolve(folderPath + `capture-${this.FILE_INDEX - 1}.jpg`);
  }

  /**
   * Reset File postfix numbering to 1.
   * CAUTION: please call this only when the capture folder is already cleared, otherwise it crash the program
   */
  static _reset_file_index() {
    CameraBackend.FILE_INDEX = 1;
  }

  /**
   * Starts video stream.
   */
  static async _start_stream(sendFrame) {
    if (!this.DEVICE_READY) throw new Error("Device has not yet setup");
    if (this.gphoto_process) throw new Error("Stream already open");
    if (!this._check_status()) throw new Error("Device is busy");

    logger.trace("Starting stream");

    this.gphoto_process = spawn("bash", ["-c", this.COMMANDS.capture_movie], {
      stdio: ["ignore", "pipe", "ignore"],
    });
    this.gphoto_process.stdout.removeAllListeners("data");
    this.PROCESS_LIVEVIEW = true;

    if (this.gphoto_process.stdout.listenerCount("data") === 0)
      this.gphoto_process.stdout.on("data", sendFrame);

    this.gphoto_process.stderr.on("data", (err) => {
      this.process.PROCESS_LIVEVIEW = false;
      this.gphoto_process = null;
      throw err;
    });
  }

  /**
   * Stops video stream.
   */
  static async _stop_stream() {
    if (this.gphoto_process) {
      logger.trace("Stopping stream");
      try {
        this.gphoto_process.stdout.removeAllListeners("data");
        this.gphoto_process.kill("SIGINT");

        await new Promise((resolve) => setTimeout(resolve), 3000);
        this.gphoto_process = null;
        this.PROCESS_LIVEVIEW = false;
      } catch (error) {
        throw error;
      }
    }
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

    await this.SEMAPHORE.acquire();
    this.PROCESS_CAPTURE = true;
    const capture = spawn("bash", ["-c", CameraBackend.COMMANDS.test_capture]);

    capture.stderr.on("error", (data) => {
      safe = false;
      this.PROCESS_CAPTURE = false;
      this.SEMAPHORE.release();
      throw new Error(`Error running test capture command: ${data}`);
    });

    capture.on("error", (error) => {
      this.PROCESS_CAPTURE = false;
      this.SEMAPHORE.release();
      throw new Error(`Camera checking error: ${error}`);
    });

    await once(capture, "close");
    this.PROCESS_CAPTURE = false;

    try {
      let exist = statSync(this.TEST_FILE_PATH);
      if (exist.size === 0) {
        safe = false;
        this.SEMAPHORE.release();
        throw new Error("Capture checkup result unresolved");
      }
      unlinkSync(CameraBackend.TEST_FILE_PATH);
    } catch (error) {
      this.SEMAPHORE.release();
      throw new Error(`Error reading test caputure image: ${error}`);
    }

    this.SEMAPHORE.release();
    if (safe) return;
    else throw new Error("Failed checkup");
  }
}

module.exports = CameraBackend;

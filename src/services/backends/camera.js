const Logger = require("../../utility/logger");
const { spawn } = require('node:child_process');
const { once } = require('events');

class CameraBackend {

  static PROCESS_CAPTURE = false;
  static PROCESS_LIVEVIEW = false;
  static DEVICE_READY = false;
  static FILE_INDEX = 1;
  static FOLDER_PATH = "";


  static COMMANDS = {
    status: "gphoto2 --auto-detect",
    get capture() {
      return `gphoto2 --capture-image-and-download --filename ${CameraBackend.FOLDER_PATH}capture-${CameraBackend.FILE_INDEX}.jpg`;
    }
  };



  /**
   * Async function to check the availability of camera device
   * @returns {Promise<boolean>} - true if the camera is readed by GPhoto2
   */
  static async _status() {
    let process = spawn('bash', ['-c', this.COMMANDS.status]);
    let output = '';
    let result = null;

    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    process.stderr.on('data', (data) => {
      CameraBackend.DEVICE_READY = false;
      throw new Error(data);
    });

    process.on('close', (code) => {
      const lines = output.split("\n");
      // This is probably not an effective way to check, but it works since we assume devices that are read by GPhoto2 are cameras
      const cameraDetected = lines.some((line) => line.trim().includes('usb:'));
      result = cameraDetected;
    });

    // await for event close to finish
    await once(process, 'close');
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
    if (this.PROCESS_CAPTURE) {
      return null;
    }

    if (!this.DEVICE_READY) {
      throw new Error("Device status is not yet determined");
    }
    if (!folderPath.endsWith('/')) {
      throw new Error("folder path argument must specify a folder (ends with '/'");
    }


    console.log('FILE INDEX: ', this.FILE_INDEX)

    // Set parameters
    this.FOLDER_PATH = folderPath
    this.PROCESS_CAPTURE = true;

    let process = spawn('bash', ['-c', this.COMMANDS.capture]);


    process.stderr.on('data', (data) => {
      this.PROCESS_CAPTURE = false
      throw new Error(data.toString());
    });

    await once(process, 'close');
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

}

module.exports = CameraBackend

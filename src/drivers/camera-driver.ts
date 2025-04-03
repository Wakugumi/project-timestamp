import system from "./system-driver";

export class CameraDriver {
  private FILE_INDEX = 1;

  private FOLDER_PATH: string = "";

  /**
   * @param {string} folder_path - path to which capture images will be written to
   */
  constructor(folder_path: string) {
    this.FOLDER_PATH = folder_path;
  }

  private COMMANDS = {
    capture(folder_path: string, file_index: number) {
      return `gphoto2 --capture-image-and-download --filename ${folder_path}capture-${file_index}.jpg`;
    },

    get capture_movie() {
      return `gphoto2 --capture-movie --stdout`;
    },

    get status() {
      return `gphoto2 --auto-detect`;
    },
  };

  /**
   * Send capture command to camera
   */
  public async capture() {
    try {
      console.log(this.COMMANDS.capture(this.FOLDER_PATH, this.FILE_INDEX));
      await system.execute("bash", [
        "-c",
        this.COMMANDS.capture(this.FOLDER_PATH, this.FILE_INDEX),
      ]);
      this.FILE_INDEX++;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Start video stream from camera
   */
  public async start_liveview(callback: (chunk: Uint8Array) => void) {
    system
      .execute(
        "bash",
        ["-c", this.COMMANDS.capture_movie],
        (stdout, stderr) => {
          const buffer = Buffer.from(stdout);
          callback(buffer);
        },
      )
      .catch((error) => {
        throw error;
      });
  }

  public async stop_liveview() {
    system.forceStop();
  }

  /**
   * Check availability status of the camera
   * @returns {Promise<boolean>} returns true if camera is available
   */
  public async status() {
    return await system
      .execute("bash", ["-c", this.COMMANDS.status])
      .then((out: string) => {
        const lines = out.split("\n");
        const detect = lines.some((line) => line.trim().includes("usb:"));

        return detect;
      })
      .catch((err) => {
        throw err;
      });
  }

  /** @returns {string} choosen folder path as provided by the constructor */
  public get getFolder() {
    return this.FOLDER_PATH;
  }

  /** Reset capture index */
  public resetIndex() {
    this.FILE_INDEX = 1;
  }
}

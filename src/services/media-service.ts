import { writeFile } from "node:fs/promises";
import FileService from "./file-service";
import { spawn } from "node:child_process";
import { once } from "ws";
import Printer from "../drivers/printer-driver";

export default class MediaService {
  static #canvasFilename = "canvas.jpg";
  static #printFilename = "print.jpg";
  static #MOTION_INDEX = 1;

  static get canvasFilename() {
    return this.#canvasFilename;
  }
  static get printFilename() {
    return this.#printFilename;
  }

  /**
   * save `Canvas` as file
   * @param {string} data - data url representation
   */
  public static async saveCanvas(data: string) {
    return new Promise<string>(async (resolve, reject) => {
      const base64data = data.replace(/^data:image\/jpeg;base64,/, "");
      const buffer = Buffer.from(base64data, "base64");

      const savePath = FileService.exportDir + this.canvasFilename;

      await writeFile(savePath, buffer)
        .then(() => {
          resolve(savePath);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * save `Motion` single frame as file
   * @param {string} data - data url representation
   */
  public static async saveMotion(data: string) {
    return new Promise((resolve, reject) => {
      const base64data = data.replace(/^data:image\/jpeg;base64,/, "");
      const buffer = Buffer.from(base64data, "base64");

      let index = this.#MOTION_INDEX;
      const savePath =
        FileService.motionDir + (index < 10 ? `0${index}.jpg` : `${index}.jpg`);

      writeFile(savePath, buffer)
        .then(() => {
          this.#MOTION_INDEX++;
          resolve(null);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * send a job to printer device
   * @param {string} data - data url representation
   */
  public static async print(data: string, quantity: number, split: boolean) {
    return new Promise(async (resolve, reject) => {
      try {
        const base64data = data.replace(/^data:image\/jpeg;base64,/, "");
        const buffer = Buffer.from(base64data, "base64");

        const savePath = FileService.exportDir + this.#printFilename;

        await writeFile(savePath, buffer);

        const process = new Printer(savePath, quantity, split);
        process.sendJob();
        resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * compile stop motion videos
   * @returns {Promise<string>} absolute path to the video file
   */
  public static async renderMotion() {
    const path = FileService.exportDir;
    const COMMAND = `ffmpeg -framerate 10 -i ./motions/%02d.jpg -vf "fps=10" -pix_fmt yuv420p ${path}video.mp4`;

    let process = spawn("bash", ["-c", COMMAND]);

    process.stdout.on("error", (err) => {
      console.error(err);
      throw err;
    });

    await once(process, "close");
    return `${path}video.mp4`;
  }
}

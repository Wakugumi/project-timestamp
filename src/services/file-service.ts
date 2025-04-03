import { readdir } from "node:fs/promises";
import path from "path";

export default class FileService {
  private static FOLDERPATH = {
    exports: process.cwd() + "/exports/",
    captures: process.cwd() + "/captures/",
    motions: process.cwd() + "/motions/",
  };

  public static get exportDir() {
    return this.FOLDERPATH.exports;
  }

  public static get captureDir() {
    return this.FOLDERPATH.captures;
  }

  public static get motionDir() {
    return this.FOLDERPATH.motions;
  }

  public static get printPath() {
    return this.FOLDERPATH.exports + "print.jpg";
  }

  public static get canvasPath() {
    return this.FOLDERPATH.exports + "canvas.jpg";
  }

  /**
   * Get all absolute path of files in export folder
   */
  public static async getExports() {
    return await readdir(this.FOLDERPATH.exports)
      .then((files) => {
        let result: string[] = [];

        files.forEach((file) => {
          result.push(path.join(this.FOLDERPATH.exports, file));
        });
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  /**
   * Get all absolute path of files in captures folder
   */
  public static async getCaptures() {
    return await readdir(this.FOLDERPATH.captures)
      .then((files) => {
        let result: string[] = [];

        files.forEach((file) => {
          result.push(path.join(this.FOLDERPATH.captures, file));
        });
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  public static async getMotions() {
    return await readdir(this.FOLDERPATH.motions)
      .then((files) => {
        let result: string[] = [];

        files.forEach((file) => {
          result.push(path.join(this.FOLDERPATH.motions, file));
        });
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }
}

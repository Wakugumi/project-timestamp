import { CameraDriver } from "../drivers/camera-driver";
import { stat, unlink } from "node:fs/promises";
import File from "./file-service";

export default class CameraService {
  private static PATH = File.captureDir;
  private static CAMERA = new CameraDriver(this.PATH);

  /** Take capture and immediately download */
  public static async capture() {
    try {
      await this.CAMERA.capture();
    } catch (error) {
      throw error;
    }
  }

  /** Check camera status, returns true if available */
  public static async status() {
    try {
      let status = await this.CAMERA.status();
      return status;
    } catch (error) {
      throw error;
    }
  }

  /** Perform diagnostic by testing camera functionalities */
  public static async checkup() {
    return new Promise(async (resolve, reject) => {
      let flag = false;
      await this.CAMERA.capture().catch((error) => reject(error));

      await File.getCaptures()
        .then((paths) => {
          paths.forEach(async (path) => {
            const fileStat = await stat(path);
            if (fileStat.isFile() && fileStat.size > 0) {
              flag = true;
              await unlink(path);
            } else {
              flag = false;
            }
          });
        })
        .catch((error) => reject(error));

      if (flag) resolve(null);
      else reject("Somehow it returns falsy");
    });
  }
}

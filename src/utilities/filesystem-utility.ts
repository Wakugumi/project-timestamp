import { readdir } from "node:fs/promises";
export class FilesystemUtility {
  public static absPath(path: string) {
    return process.cwd() + path;
  }
  public static readDir(path: string) {
    return new Promise<string[]>((resolve, reject) => {
      readdir(path)
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

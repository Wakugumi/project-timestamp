import { readdirSync, unlink } from "node:fs";
import { CameraDriver } from "../camera-driver";
import path from "path";

const Camera = new CameraDriver(process.cwd() + "/captures/");

describe("Camera capture functionality", () => {
  test("Camera should capture", async () => {
    if (!(await Camera.status())) {
      console.warn("Camera not present, returning pass instead");
      return true;
    }
    await Camera.capture();
    await Camera.capture();

    const files = readdirSync(Camera.getFolder);
    console.log(files);
    expect(files.length).toBeTruthy();

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(Camera.getFolder + file);
        unlink(filePath, (err) => {
          throw err;
        });
      }),
    );

    Camera.resetIndex();
  }, 10000);

  xtest("Camera liveview should pipe stdout properly", async () => {
    if (!(await Camera.status())) {
      console.warn("Camera not present, returning pass instead");
      return true;
    }

    await Camera.start_liveview((chunk) => {
      if (chunk.trim()) {
        Camera.stop_liveview();
        expect(chunk.trim()).toBeTruthy();
      }
    });
  }, 10000);
});

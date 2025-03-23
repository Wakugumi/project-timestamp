import { readdir } from "node:fs/promises";
import Camera from "../camera-service";
import FileService from "../file-service";
describe("Camera Service", () => {
  test("Test camera checkup diagnostic function", async () => {
    try {
      await Camera.checkup();

      const files = await FileService.getCaptures();

      expect(files).toBeFalsy();
    } catch (error) {
      throw error;
    }
  });
});

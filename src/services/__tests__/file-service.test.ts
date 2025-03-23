import { writeFile, readFile, unlink } from "node:fs/promises";
import File from "../file-service";
import path from "path";

describe("File service", () => {
  test("Captures directory and files", async () => {
    const folder = File.captureDir;
    const name = "test.test";
    const folderPath = path.join(folder, name);

    await writeFile(folderPath, "test").catch((error) => {
      throw error;
    });

    const files = await File.getCaptures();

    files.forEach(async (file) => {
      const read = await readFile(file, { encoding: "utf8" });
      expect(read).toBeTruthy();
    });

    await unlink(folderPath);
  });

  test("Exports directory and files", async () => {
    const folder = File.exportDir;
    const name = "test.test";

    const folderPath = path.join(folder, name);

    await writeFile(folderPath, "test").catch((error) => {
      throw error;
    });

    const files = await File.getExports();

    files.forEach(async (file) => {
      const read = await readFile(file, { encoding: "utf8" });
      expect(read).toBeTruthy();
    });

    await unlink(folderPath);
  });

  test("Motions directory and files", async () => {
    const folder = File.motionDir;
    const name = "test.test";

    const folderPath = path.join(folder, name);

    await writeFile(folderPath, "test").catch((error) => {
      throw error;
    });

    const files = await File.getMotions();

    files.forEach(async (file) => {
      const read = await readFile(file, { encoding: "utf8" });
      expect(read).toBeTruthy();
    });

    await unlink(folderPath);
  });
});

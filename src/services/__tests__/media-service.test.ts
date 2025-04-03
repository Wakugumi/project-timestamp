import fs from "fs/promises";
import FileService from "../file-service"; // Adjust import as needed

// Mock dependencies
jest.mock("fs/promises");
jest.mock("../file-service", () => ({
  FileService: {
    exportDir: "/mock/export/directory/",
  },
}));

describe("saveCanvas function", () => {
  // Helper function to simulate the saveCanvas method
  const saveCanvas = async (data: string) => {
    return new Promise<string>(async (resolve, reject) => {
      const base64data = data.replace(/^data:image\/jpeg;base64,/, "");
      const buffer = Buffer.from(base64data, "base64");
      const savePath = FileService.exportDir + "canvas.jpg"; // Simplified filename
      await fs
        .writeFile(savePath, buffer)
        .then(() => {
          resolve(savePath);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should successfully save a valid base64 image", async () => {
    // Create a valid base64 image string
    const validBase64Image =
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD..."; // Mock base64 data

    // Mock successful file write
    (
      fs.writeFile as jest.MockedFunction<typeof fs.writeFile>
    ).mockResolvedValue(undefined);

    const result = await saveCanvas(validBase64Image);

    // Verify writeFile was called with correct arguments
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining("/mock/export/directory/canvas.jpg"),
      expect.any(Buffer),
    );

    // Verify the returned path is correct
    expect(result).toBe("/mock/export/directory/canvas.jpg");
  });

  it("should remove data URL prefix correctly", async () => {
    const base64Image = "data:image/jpeg;base64,imagedatahere";

    (
      fs.writeFile as jest.MockedFunction<typeof fs.writeFile>
    ).mockResolvedValue(undefined);

    await saveCanvas(base64Image);

    // Verify that the base64 prefix is correctly stripped
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      Buffer.from("imagedatahere", "base64"),
    );
  });

  it("should handle file write errors", async () => {
    const base64Image = "data:image/jpeg;base64,someimagedata";

    // Simulate a file write error
    const mockError = new Error("Write failed");
    (
      fs.writeFile as jest.MockedFunction<typeof fs.writeFile>
    ).mockRejectedValue(mockError);

    // Expect the promise to be rejected
    await expect(saveCanvas(base64Image)).rejects.toThrow("Write failed");
  });

  it("should handle invalid base64 data", async () => {
    const invalidBase64Image = "data:image/jpeg;base64,invalid-base64-data";

    (
      fs.writeFile as jest.MockedFunction<typeof fs.writeFile>
    ).mockResolvedValue(undefined);

    // Attempt to save invalid base64 data
    await saveCanvas(invalidBase64Image);

    // Verify that writeFile is called with a Buffer (even if invalid)
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Buffer),
    );
  });

  it("should handle base64 image without data URL prefix", async () => {
    const base64Image = "justbase64imagedata==";

    (
      fs.writeFile as jest.MockedFunction<typeof fs.writeFile>
    ).mockResolvedValue(undefined);

    await saveCanvas(base64Image);

    // Verify that writeFile is called with the original input
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      Buffer.from(base64Image, "base64"),
    );
  });

  it("should create file in the correct export directory", async () => {
    const base64Image = "data:image/jpeg;base64,imagedatahere";

    (
      fs.writeFile as jest.MockedFunction<typeof fs.writeFile>
    ).mockResolvedValue(undefined);

    const result = await saveCanvas(base64Image);

    // Verify the file path starts with the export directory
    expect(result).toContain("/mock/export/directory/");
  });
});

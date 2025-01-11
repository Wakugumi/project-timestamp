const { fstatSync, statSync, readdirSync } = require("node:fs");
const Device = require("../../../src/services/DeviceService");
const { unlink } = require("node:fs/promises");
const path = require('path');


describe('Device service functions', () => {
  let cameraReady = undefined
  test("Device checking function", async () => {
    expect(await Device.check()).toBeDefined()
  });

  test('Camera capture test', async () => {
    if (!(await Device.check())) {
      console.log("camera not present, skipping");
      return true;
    }
    await Device.capture('./test-captures/');
    const files = readdirSync('./test-captures/');
    expect(files.length).toBeTruthy();
    // clear test directory
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join('./test-captures/', file);
        await unlink(filePath);
      })
    )

  }, 10000)

})

const { PROCESS_LIVEVIEW } = require("../services/backends/camera");
const device = require("../services/DeviceService.js");
const route = require("express").Router();

route.get("/start", async (req, res, next) => {
  try {
    await device.startStream();
    res.status(200).send("ready");
  } catch (error) {
    next(error);
  }
});

route.get("/stop", async (req, res, next) => {
  try {
    await device.stopStream();
    res.status(200).send("ok");
  } catch (error) {
    next(error);
  }
});

module.exports = route;

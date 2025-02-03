const { PROCESS_LIVEVIEW } = require("../services/backends/camera");
const device = require("../services/DeviceService.js");
const route = require("express").Router();

route.get("/", (req, res, next) => {
  res.setHeader("Content-Type", "multipart/x-mixed-replace; boundary=frame");
  const { gphoto, ffmpeg } = device.stream(res);

  req.on("close", () => {
    gphoto.kill();
    ffmpeg.kill();
  });
});

module.exports = route;

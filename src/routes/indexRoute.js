const route = require("express").Router();
const device = require("../services/DeviceService.js");
const sessionRoute = require("./sessionRoute");
const testRoute = require("./testRoute");

route.get("/", (req, res, next) => {
  res.send("Hello");
});

route.get("/boot", async (req, res, next) => {
  try {
    await device.bootup();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

route.get("/status", async (req, res, next) => {
  try {
    const status = await device.check();
    if (status) {
      res.status(200).send("ready");
    } else {
      res.status(200).send("not ready");
    }
  } catch (error) {
    next(error);
  }
});

route.get("/capture", async (req, res, next) => {
  try {
    await device.capture();
    res.status(200).send("success");
  } catch (error) {
    next(error);
  }
});

route.get("/checkup", async (req, res, next) => {
  try {
    await device.checkup();
    res.status(200).send("ok");
  } catch (error) {
    next(error);
  }
});

route.use("/session", sessionRoute);

route.use("/test", testRoute);

module.exports = route;

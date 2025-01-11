const route = require('express').Router()
const device = require("../services/DeviceService.js")
const sessionRoute = require("./sessionRoute");


route.get('/', (req, res, next) => {
  res.send("Hello")
})

route.get("/boot", async (req, res, next) => {
  try {
    await device.bootup();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
})

route.get('/status', async (req, res, next) => {
  try {
    await device.check();
    res.status(200).send("ready")
  } catch (error) {
    next(error)
  }
});

route.get("/capture", async (req, res, next) => {
  try {
    await device.capture();
    res.status(200).send("success");
  } catch (error) {
    next(error)
  }
});


route.use('/session', sessionRoute);

module.exports = route;

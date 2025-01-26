const route = require("express").Router();
const StorageService = require("../services/StorageService.js");

route.post("/upload", async (req, res, next) => {
  try {
    const storage = new StorageService(
      req.body.file_name,
      req.body.folder,
      "write",
    );
    const url = await storage.getSignedUrl();
    return res.status(200).send(url);
  } catch (error) {
    next(error);
  }
});

route.post("/test", async (req, res, next) => {
  console.log(req.body);
  res.status(201).json(req.body);
});

module.exports = route;

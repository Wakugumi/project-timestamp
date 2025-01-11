const route = require('express').Router();
const File = require('../services/FileService.js');

route.get('/reset', async (req, res, next) => {
  try {
    await File.resetSession();
    res.status(200).send("success");
  }

  catch (error) {
    next(error);
  }
})


module.exports = route

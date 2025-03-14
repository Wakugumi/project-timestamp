const api = require("./APIService.js");
const state = require("../helpers/StateManager.js");
const { Worker } = require("node:worker_threads");
const File = require("./FileService.js");
const path = require("node:path");
const { logger } = require("../utility/logger.js");

exports.startUpload = async (count, src = [], url) => {
  try {
    (await File.getExports()).forEach((x) => src.push(x));
  } catch (error) {
    console.error(error);
    throw error;
  }

  const filePaths = src;

  let results = [];
  let completed = 0;

  console.log("Will iterate through uploads");
  filePaths.forEach((file, index) => {
    const uploadUrl = url.images[index].url;
    const worker = new Worker(
      path.join(__dirname, "../workers/uploadWorker.js"),
      {
        workerData: { filePath: file, uploadUrl: uploadUrl },
      },
    );

    worker.on("message", (message) => {
      results[index] = { file, ...message };
      completed++;

      logger.info(message.message);
      logger.info(message.response);

      if (completed === filePaths.length)
        return new Promise((resolve) => resolve(results));
    });

    worker.on("error", (err) => {
      logger.error(`Uploading error in worker`, err);

      results[index] = { file, status: "error", message: err.message };
      completed++;
      if (completed === filePaths.length)
        return new Promise((resolve) => resolve(results));
    });

    worker.on("exit", (code) => {
      if (code !== 0) logger.warn("Upload worker exited with code", code);
    });
  });
};

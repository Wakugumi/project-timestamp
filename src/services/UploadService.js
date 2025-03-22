const { Worker } = require("node:worker_threads");
const File = require("./FileService.js");
const path = require("node:path");
const { logger } = require("../utility/logger.js");

exports.startUpload = async (imgSrc = [], videoSrc, imageUrl, videoUrl) => {
  let results = [];
  let completed = 0;

  imgSrc.forEach((file, index) => {
    let uploadUrl = imageUrl[index].url;
    const worker = new Worker(
      path.join(__dirname, "../workers/uploadWorker.js"),
      {
        workerData: {
          filePath: file,
          uploadUrl: uploadUrl,
          type: "image",
        },
      },
    );

    worker.on("message", (message) => {
      results[index] = { file, ...message };
      completed++;

      logger.info(message.message);
      logger.info(message.response);

      if (completed === imgSrc.length)
        return new Promise((resolve) => resolve(results));
    });

    worker.on("error", (err) => {
      logger.error(`Uploading error in worker`, err);

      results[index] = { file, status: "error", message: err.message };
      completed++;
      if (completed === imgSrc.length)
        return new Promise((resolve) => resolve(results));
    });

    worker.on("exit", (code) => {
      if (code !== 0) logger.warn("Upload worker exited with code", code);
    });
  });

  const worker = new Worker(
    path.join(__dirname, "../workers/uploadWorker.js"),
    {
      workerData: {
        filePath: videoSrc,
        uploadUrl: videoUrl,
        type: "video",
      },
    },
  );

  worker.on("message", (message) => {
    results[results.length + 1] = { videoSrc, ...message };
    completed++;

    logger.info(message.message);
    logger.info(message.response);

    if (completed === videoSrc.length)
      return new Promise((resolve) => resolve(results));
  });

  worker.on("error", (err) => {
    logger.error(`Uploading error in worker`, err);

    results[results.length + 1] = {
      videoSrc,
      status: "error",
      message: err.message,
    };
    completed++;
    if (completed === videoSrc.length)
      return new Promise((resolve) => resolve(results));
  });

  worker.on("exit", (code) => {
    if (code !== 0) logger.warn("Upload worker exited with code", code);
  });
};

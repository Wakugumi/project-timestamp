const { spawn } = require("node:child_process");
const api = require("./APIService.js");
const state = require("../helpers/stateManager.js");
const { Worker } = require("node:worker_threads");
const File = require("./FileService.js");
const path = require("node:path");

exports.startUpload = async (count) => {
  /** @type {import('./APIService.js').UploadResponse} */
  const url = await api.upload(count);
  state.set("upload", url);
  const filePaths = File.getCaptures();
  let results = [];
  let completed = 0;

  filePaths.forEach((file, index) => {
    const uploadUrl = url.images[index].url;
    const worker = new Worker(
      path.join(__dirname, "../workers/uploadWorker.js"),
      {
        workerData: { file, uploadUrl },
      },
    );

    worker.on("message", (message) => {
      console.log(`[UploadService] File ${index + 1} completed: ${file}`);
      results[index] = { file, ...message };
      completed++;

      if (completed === filePaths.length) resolve(results);
    });

    worker.on("error", (err) => {
      console.error("[UploadService] Error in worker:", err);

      results[index] = { file, status: "error", message: err.message };
      completed++;
      if (completed === filePaths.length) resolve(results);
    });

    worker.on("exit", (code) => {
      if (code !== 0)
        console.warn(`[UploadService] Worker exited with code ${code}`);
    });
  });
};

const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");
const axios = require("axios");

async function uploadFile(filePath, uploadUrl) {
  try {
    parentPort.postMessage({
      status: "start",
      message: "Upload Worker starts",
      response: null,
    });

    const data = fs.readFileSync(filePath);

    const response = await axios.put(uploadUrl, data, {
      headers: {
        "Content-Disposition": "attachment",
        "Content-Type": "image/png",
      },
    });

    parentPort.postMessage({
      status: "resolve",
      meesage: "Upload process resolves",
      response: `${response.status} - ${response.data}`,
    });
  } catch (error) {
    parentPort.postMessage({
      status: "error",
      message: error.message,
      response: null,
    });
  }
}

uploadFile(workerData.filePath, workerData.uploadUrl);

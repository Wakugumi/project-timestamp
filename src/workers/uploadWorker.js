const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

async function uploadFile(filePath, uploadUrl) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.put(uploadUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        "Content-Disposition": "attachment",
      },
    });

    parentPort.postMessage({ status: "success", data: response.data });
  } catch (error) {
    parentPort.postMessage({ status: "error", message: error.message });
  }
}

uploadFile(workerData.filePath, workerData.uploadUrl);

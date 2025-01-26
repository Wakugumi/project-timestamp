// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");

// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

const storage = new Storage({ keyFilename: "key.json" });

const bucketName = "timestamp-storage";
const bucket = storage.bucket(bucketName);

/**
 *  @param {fileName} - name of the file to be written
 *
 */
class StorageService {
  constructor(fileName, folderName, permission) {
    this.fileName = fileName;
    this.folderName = folderName;
    this.config = {
      action: permission,
      expires: new Date(
        new Date().getTime() + process.env.STORAGE_SIGNEDURL_EXPIRE * 1000,
      ),
    };
  }

  async getSignedUrl() {
    const [url] = await bucket.file(this.fileName).getSignedUrl(this.config);
    return url;
  }
}

module.exports = StorageService;

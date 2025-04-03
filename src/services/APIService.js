const axios = require("axios");
const state = require("../helpers/StateManager.js");

const api = axios.create({
  baseURL: "https://timestamp.fun/api",
  headers: {
    Token: process.env.BOOTH_ID,
  },
});

/**
 * @typedef {Object} ImageUrl
 * @property {string} id - identification number for the object in database
 * @property {string} url - Bucket SignedUrl for uploading image
 */

/**
 * @typedef {Object} VideoUrl
 * @property {string} id - identiication numbre for the object in database
 * @property {string} url - Bucket SignedUrl for uploading video
 */

/**
 * @typedef {Object} UploadResponse
 * @property {string} id - identification number of user View page
 * @property {ImageUrl[]} images - set of images
 * @property {VideoUrl} video - video upload url and id in a single object
 */

/**
 * Returns upload url for captures and result picture
 * @param {number} ImageCount number of capture + a frame with pictures
 * @returns {Promise<UploadResponse>} Promise function with object UploadResponse
 */
exports.upload = async (ImageCount) => {
  return await api
    .post("/pages", {
      ImageCount: ImageCount,
    })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

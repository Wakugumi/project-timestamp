const { default: axios } = require("axios");

const api = axios.create({
  baseURL: "https://timestamp.fun/booths",
});

exports.report = (message, ...args) => {};

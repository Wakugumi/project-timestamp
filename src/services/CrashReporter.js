const { default: axios } = require("axios");
const { getUnixTimestampString } = require("../utility/DateUtility");

const api = axios.create({
  baseURL: "https://timestamp.fun/api/boothLogs",
});

exports.crashReport = async (message, ...args) => {
  await api.post("", {
    message: message + args.join(" "),
    level: 0,
    timestamp: getUnixTimestampString(),
  });
};

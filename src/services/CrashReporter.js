const { default: axios } = require("axios");
const { getUnixTimestampString } = require("../utility/DateUtility");
const { logger } = require("../utility/logger");

const api = axios.create({
  baseURL: "https://timestamp.fun/api",
  headers: {
    Token: process.env.BOOTH_TOKEN,
  },
});

exports.crashReport = async (message, ...args) => {
  await api
    .post(
      "boothLogs",
      {
        message: message + args.join(" "),
        level: 0,
        timestamp: getUnixTimestampString(),
      },
      {
        headers: {
          Token: process.env.BOOTH_TOKEN,
        },
      },
    )
    .then((response) => {
      logger.debug(response);
    });
};

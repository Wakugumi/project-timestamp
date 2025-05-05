const { default: axios } = require("axios");
const winston = require("winston");

/** Define custom levels
 *
 * As per discussion, we confirmed with backend to use the following
 * @readonly
 * @enum {number}
 */
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "white",
    debug: "gray whiteBG",
    trace: "blue",
  },
};

winston.addColors(logLevels.colors);
exports.logger = winston.createLogger({
  levels: logLevels.levels,
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta) : ""
      }`;
    }),
  ),

  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ""
          }`;
        }),
      ),
    }),
    new winston.transports.File({
      filename: "logs.log",
      format: winston.format.json(),
    }),
    new winston.transports.File({
      level: "error",
      filename: "error.log",
    }),
  ],
});
const logWrapper = (level, message, ...args) => {
  const msg = [
    message,
    ...args.map((arg) =>
      typeof arg === "object" ? JSON.stringify(arg) : String(arg),
    ),
  ].join(" ");
  this.logger.log(level, msg);
};

exports.debug = (msg, ...args) => logWrapper("debug", msg, args);
exports.info = (msg, ...args) => logWrapper("info", msg, args);
exports.warn = (msg, ...args) => logWrapper("warn", msg, args);
exports.trace = (msg, ...args) => logWrapper("trace", msg, args);
exports.error = (msg, ...args) => logWrapper("error", msg, args);

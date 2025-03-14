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

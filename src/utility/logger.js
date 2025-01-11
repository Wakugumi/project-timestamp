const fs = require('fs');
const path = require('path/win32');


class LogEntry {
  constructor(timestamp, code, message) {
    this.timestamp = timestamp;
    this.code = code;
    this.message = message;
  }
}

class Logger {

  _log(level, code, message) {
    let timestamp = new Date().toString();
    let newLog = new LogEntry(timestamp, code, message);
    let formattedMessage = `[${newLog.timestamp}] [${newLog.level} - ${newLog.code}] ${newLog.message.toString()}\n`;
    switch (level) {
      case "log":
        console.log(formattedMessage, newLog.message);
        break;
      case "warn":
        console.warn(formattedMessage, newLog.message);
      case "error":
        console.error(formattedMessage, newLog.message);
    }
    let logFilePath = path.join("log.txt")
    let stream = fs.createWriteStream(logFilePath, { flags: 'a' });
    stream.once('open', function (fd) {
      stream.write(formattedMessage);
      stream.end();
    });
  }
  /**
  * Log a message
  * @type void
  * @param {string} logCode - for general purpose every instance can create new code, but our domain specific will be "FILESYSTEM" | "DEVICE" | "INTERNAL"
  * @param {any} message - message passed to base class, where console.[level] will be called upon
  */
  static log(logCode, message) {
    let logger = new Logger();
    logger._log("log", logCode, message);
  }

  /**
  * Log a warning message
  * @type void
  * @param {string} logCode - for general purpose every instance can create new code, but our domain specific will be "FILESYSTEM" | "DEVICE" | "INTERNAL"
  * @param {any} message - message passed to base class, where console.[level] will be called upon
  */
  static warn(logCode, message) {
    (new Logger())._log("warn", logCode, message)
  }

  /**
  * Log an error message @type void
  * @param {string} logCode - for general purpose every instance can create new code, but our domain specific will be "FILESYSTEM" | "DEVICE" | "INTERNAL"
  * @param {any} message - message passed to base class, where console.[level] will be called upon
  */
  static error(logCode, message) {
    (new Logger())._log("error", logCode, message);
  }
}

module.exports = Logger;

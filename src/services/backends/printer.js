const { once } = require("events");
const { spawn } = require("node:child_process");

class PrinterBackend {
  static COMMANDS = [];

  /**
   * Create new job and immediately send to printing server
   * @param {string} filePath absolute path to the binary file to be send to printing server
   * @return {Promise<void>}
   */
  static async job(filePath) {}
}

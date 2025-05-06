const { WebSocketServer } = require("ws");
const CameraBackend = require("./backends/camera");
const { logger } = require("../utility/logger");

exports.start = (window) => {
  const wss = new WebSocketServer({ port: 8080 });

  logger.debug("starating web socket");
  wss.on("connection", async (ws) => {
    logger.debug("a ws connection");
    wss.on("listening", () => {
      logger.trace("Web socket is listening");
    });
    let buffer = Buffer.alloc(0);

    CameraBackend._start_stream((chunk) => {
      buffer = Buffer.concat([buffer, chunk]);

      if (buffer.length > 10000)
        if (buffer.includes(Buffer.from([0xff, 0xd9]))) {
          window.webContents.send("stream", buffer);
          buffer = Buffer.alloc(0);
        }
    });

    ws.on("close", async () => {
      console.log("A connection is closed");
      await CameraBackend._stop_stream();
    });
  });
  wss.on("error", (err) => {
    console.error(err);
    logger.error(err);
  });
};

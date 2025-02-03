const express = require("express");
const dotenv = require("dotenv");
const route = require("./routes/indexRoute");
const bodyParser = require("body-parser");
const { WebSocketServer } = require("ws");
dotenv.config();
const app = express();
const cors = require("cors");
const CameraBackend = require("./services/backends/camera");

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(require("./middleware/responseInterceptor"));
app.use(require("./middleware/errorHandler"));

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  wss.clients.forEach((client) => {
    console.log("Conntected", client.url);
  });
  try {
    CameraBackend._start_stream((chunk) => {
      ws.send(chunk, { binary: true });
    });
  } catch (error) {
    console.log(error);
  }
  wss.on("error", (err) => {
    console.error(err);
  });
  ws.on("close", () => {
    CameraBackend._stop_stream();
  });
});

app.use("/v1", route);

app.listen(process.env.API_PORT, () => {
  console.log("App started at localhost, port ", process.env.API_PORT);
});

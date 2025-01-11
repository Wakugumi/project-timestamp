const express = require('express');
const dotenv = require('dotenv');
const route = require('./routes/indexRoute')
dotenv.config();
const app = express();

// Middlewares
app.use(require('./middleware/responseInterceptor'));
app.use(require('./middleware/errorHandler'));


app.use("/v1", route);

app.listen(process.env.API_PORT, () => {
  console.log("App started at localhost, port ", process.env.API_PORT)
})

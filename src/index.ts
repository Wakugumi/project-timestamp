import express, { Express } from 'express';
const dotenv = require('dotenv');

dotenv.config();
const app : Express = express();
import route from './routes/indexRoute';

app.use("/v1/", route);

app.listen(process.env.API_PORT, () => {
    console.log("App started at localhost, port ", process.env.API_PORT)
})
import { Router } from 'express';
import captureRoute from './captureRoute';

const route = Router()


route.get('/', (req, res, next) => {
    res.send("Hello")
})

route.use('/capture', captureRoute)

export default route;
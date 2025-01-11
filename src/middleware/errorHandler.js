
const errorHandler = (err, req, res, next) => {
  res.status(500).send(err);
  next();
}

module.exports = errorHandler

const responseInterceptor = (req, res, next) => {
  const originalSend = res.send.bind(res);

  res.send = function (body) {
    if (res.statusCode === 200) {
      const response = {
        message: body
      }
      return originalSend(JSON.stringify(response));
    }
    else if (res.statusCode === 500) {
      const response = {
        error: body
      }
      return originalSend(JSON.stringify(response));
    }
    else {
      return originalSend(body);
    }
  };

  next();

}

module.exports = responseInterceptor

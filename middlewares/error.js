function errorHandler(err, req, res, next) {
  if (err.status) {
    res.status(err.status).json({ status: err.status, message: err.message });
  } else {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
}

module.exports = errorHandler;

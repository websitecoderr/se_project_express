const { logger } = require("./logger");

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  logger.error("🔥 Unhandled error", {
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500
      ? "An error occurred on the server"
      : err.message;

  res.status(statusCode).json({ message });
};


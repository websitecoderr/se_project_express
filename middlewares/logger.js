const { createLogger, format, transports } = require("winston");
const expressWinston = require("express-winston");
const path = require("path");

const logDir = "logs";
const errorLog = path.join(logDir, "error.log");
const combinedLog = path.join(logDir, "combined.log");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: combinedLog }),
    new transports.File({ filename: errorLog, level: "error" }),
  ],
});

const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: () => false,
});

const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
});

module.exports = {
  logger,
  requestLogger,
  errorLogger,
};

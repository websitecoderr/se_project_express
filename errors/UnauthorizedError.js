class UnauthorizedError extends Error {
  constructor(message = "Unauthorized access") {
    super(message);
    this.statusCode = 401;
    this.name = "UnauthorizedError";
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = UnauthorizedError;

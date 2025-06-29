module.exports = (err, req, res, next) => {
  console.error("🔥 Error:", err);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? "An error occurred on the server"
    : err.message;

  res.status(statusCode).json({ message });
};

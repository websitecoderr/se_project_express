require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const {
  validateUserBody,
  validateAuthentication,
} = require("./middlewares/validation");
const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/clothingItems");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/error-handler");

const { PORT = 3001, MONGO_URI = "mongodb://127.0.0.1:27017/wtwrDB" } =
  process.env;
const { NOT_FOUND } = require("./utils/statusCodes");
const logger = require("./logger"); 

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(requestLogger);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info("✅ Connected to MongoDB");
  })
  .catch((err) => {
    logger.error("❌ MongoDB connection error", { message: err.message, stack: err.stack });
    process.exit(1);
  });

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/api/signin", validateAuthentication, login);
app.post("/api/signup", validateUserBody, createUser);

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "❌ Resource not found" });
});

app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server is running at http://127.0.0.1:${PORT}`);
});

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  logger.info("🛑 MongoDB disconnected via app termination");
  server.close(() => {
    logger.info("🔌 Server stopped");
    process.exit(0);
  });
});

module.exports = app;


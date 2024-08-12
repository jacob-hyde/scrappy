const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./../.env") });

const config = {
  NODE_ENV: process.env.NODE_ENV || "local",
  LOGGER: process.env.LOGGER || "console",
  LOGGER_LEVEL: process.env.LOGGER_LEVEL || "debug",
  MONGO_HOST: process.env.MONGO_HOST || "mongodb://127.0.0.1:27017",
  MONGO_TLS_CA: process.env.MONGO_TLS_CA || null,
  MONGO_TLS_CERT: process.env.MONGO_TLS_CERT || null,
  MONGO_DB: process.env.MONGO_DB || "scrappy",
  MONGO_USER: process.env.MONGO_USER || null,
  MONGO_PASS: process.env.MONGO_PASS || null,
  MONGO_AUTH_DB: process.env.MONGO_AUTH_DB || null,
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: process.env.REDIS_PORT || "6379",
  REDIS_PASS: process.env.REDIS_PASS || null,
};

export default config;
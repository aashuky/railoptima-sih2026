require("dotenv").config();

const toInt = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: toInt(process.env.PORT, 5000),
  corsOrigin: process.env.CORS_ORIGIN || "*",
  rateLimit: {
    windowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000), // 15 min
    max: toInt(process.env.RATE_LIMIT_MAX, process.env.NODE_ENV === "production" ? 100 : 10000)
  }
};

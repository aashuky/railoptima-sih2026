require("dotenv").config();

const toInt = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const jwtExpiresIn = /^[0-9]+(s|m|h|d|w|y)$/i.test(process.env.JWT_EXPIRES_IN || "")
  ? process.env.JWT_EXPIRES_IN
  : "7d";

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: toInt(process.env.PORT, 5000),
  corsOrigin: process.env.CORS_ORIGIN || "*",
  jwt: {
    secret: process.env.JWT_SECRET || "railoptima-development-secret",
    expiresIn: jwtExpiresIn
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    timeoutMs: toInt(process.env.GEMINI_TIMEOUT_MS, 12000)
  },
  rateLimit: {
    windowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000), // 15 min
    max: toInt(process.env.RATE_LIMIT_MAX, process.env.NODE_ENV === "production" ? 100 : 10000)
  }
};

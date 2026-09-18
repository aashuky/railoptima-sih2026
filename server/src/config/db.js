const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    logger.error("MONGODB_URI is not configured. Add it to server/.env before starting the API.");
    throw new Error("MONGODB_URI is not configured. Add it to server/.env before starting the API.");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || "railoptima",
    });

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed:", { message: error.message });
    process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require("mongoose");
const logger = require("../utils/logger");

let isConnected = false;

const connectDB = async () => {
  // If already connected (1) or connecting (2), reuse active connection
  if (isConnected || mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    logger.error("MONGODB_URI is not configured. Add it to environment variables before starting the API.");
    throw new Error("MONGODB_URI is not configured. Add it to environment variables before starting the API.");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || "railoptima",
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    logger.info("MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    logger.error("MongoDB connection failed:", { message: error.message });
    throw error;
  }
};

module.exports = connectDB;

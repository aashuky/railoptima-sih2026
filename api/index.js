// Vercel Serverless Function Handler for RailOptima Express API
const app = require("../server/src/app");
const connectDB = require("../server/src/config/db");

let isConnected = false;

module.exports = async (req, res) => {
  // Connect to MongoDB Atlas if not already connected
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error("MongoDB Atlas connection error in Vercel function:", err.message);
    }
  }

  // Ensure request URL maintains the /api prefix for Express routing
  if (req.url && !req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
  }

  return app(req, res);
};

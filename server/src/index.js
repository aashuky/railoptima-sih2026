const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// API Routes
app.use("/api", apiRoutes);

// Root Health & System Status Endpoint
app.get("/", (req, res) => {
  res.json({
    system: "RailOptima - AI-Powered Automatic Block Planning",
    organization: "Indian Railways | Centre for Railway Information Systems (CRIS)",
    status: "Operational",
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal RailOptima Server Error",
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` RAILOPTIMA REST API SERVER RUNNING`);
  console.log(` Port: ${PORT}`);
  console.log(` Base URL: http://localhost:${PORT}/api`);
  console.log(` Maintenance Queue: http://localhost:${PORT}/api/maintenance`);
  console.log(` Dashboard Summary: http://localhost:${PORT}/api/dashboard/summary`);
  console.log(` Available Blocks:  http://localhost:${PORT}/api/blocks`);
  console.log(`====================================================`);
});

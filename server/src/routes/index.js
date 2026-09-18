const express = require("express");

const router = express.Router();

const blockRoutes = require("./blockRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const maintenanceRoutes = require("./maintenanceRoutes");
const optimizerRoutes = require("./optimizerRoutes");
const plansRoutes = require("./plansRoutes");
const { runOptimizer } = require("../controllers/optimizerController");
const { resetDemoData } = require("../controllers/plansController");

// Blocks
router.use("/blocks", blockRoutes);

// Dashboard
router.use("/dashboard", dashboardRoutes);

// Maintenance
router.use("/maintenance", maintenanceRoutes);

// Optimizer (supports both /optimize and /optimizer)
router.post("/optimize", runOptimizer);
router.use("/optimizer", optimizerRoutes);

// Plans
router.use("/plans", plansRoutes);

// Reset demo data
router.post("/reset", resetDemoData);

module.exports = router;

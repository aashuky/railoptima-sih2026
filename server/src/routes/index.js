
const express = require("express");

const router = express.Router();

const blockRoutes = require("./blockRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const maintenanceRoutes = require("./maintenanceRoutes");
const optimizerRoutes = require("./optimizerRoutes");
const plansRoutes = require("./plansRoutes");

// Blocks
router.use("/blocks", blockRoutes);

// Dashboard
router.use("/dashboard", dashboardRoutes);

// Maintenance
router.use("/maintenance", maintenanceRoutes);

// Optimizer
router.use("/optimizer", optimizerRoutes);

// Plans
router.use("/plans", plansRoutes);

module.exports = router;


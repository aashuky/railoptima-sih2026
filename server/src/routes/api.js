const express = require("express");
const router = express.Router();

const { getMaintenanceTasks } = require("../controllers/maintenanceController");
const { getBlocksList } = require("../controllers/blocksController");
const { getDashboardSummary } = require("../controllers/summaryController");
const { runOptimizer } = require("../controllers/optimizerController");
const { approvePlan, resetDemoData } = require("../controllers/plansController");

// Operational Endpoints
router.get("/maintenance", getMaintenanceTasks);
router.get("/blocks", getBlocksList);
router.get("/dashboard/summary", getDashboardSummary);
router.post("/optimize", runOptimizer);
router.put("/plans/:planId/approve", approvePlan);
router.post("/reset", resetDemoData);

module.exports = router;

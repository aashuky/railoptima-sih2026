const express = require("express");

const router = express.Router();

const blockRoutes = require("./blockRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const maintenanceRoutes = require("./maintenanceRoutes");
const optimizerRoutes = require("./optimizerRoutes");
const plansRoutes = require("./plansRoutes");
const authRoutes = require("./authRoutes");
const aiRoutes = require("./aiRoutes");
const { runOptimizer } = require("../controllers/optimizerController");
const { resetDemoData } = require("../controllers/plansController");
const { getCorridorsList } = require("../controllers/corridorsController");
const { requireAuth } = require("../middleware/requireAuth");
const { requireRoles } = require("../middleware/roleAccess");

// Authentication & AI
router.use("/auth", authRoutes);
router.use("/ai", aiRoutes);

// All operational data and mutations require an authenticated control-room user
router.use(requireAuth);

// Corridors (Map & Network)
router.get("/corridors", getCorridorsList);

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

// Reset demo data - only Admin role permitted
router.post("/reset", requireRoles("admin"), resetDemoData);

module.exports = router;

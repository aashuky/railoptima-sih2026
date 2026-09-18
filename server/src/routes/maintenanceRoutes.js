const express = require("express");
const router = express.Router();
const { getMaintenanceTasks } = require("../controllers/maintenanceController");

router.get("/", getMaintenanceTasks);

module.exports = router;

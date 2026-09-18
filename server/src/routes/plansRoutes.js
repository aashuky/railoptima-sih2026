const express = require("express");
const router = express.Router();
const { approvePlan } = require("../controllers/plansController");
const { requireRoles } = require("../middleware/roleAccess");

router.put("/:planId/approve", requireRoles("controller", "admin"), approvePlan);

module.exports = router;

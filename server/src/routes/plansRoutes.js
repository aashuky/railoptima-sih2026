const express = require("express");
const router = express.Router();
const { approvePlan } = require("../controllers/plansController");

router.put("/:planId/approve", approvePlan);

module.exports = router;

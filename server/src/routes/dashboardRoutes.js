const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controllers/summaryController");

router.get("/summary", getDashboardSummary);

module.exports = router;

const express = require("express");
const router = express.Router();
const { runOptimizer } = require("../controllers/optimizerController");

router.post("/", runOptimizer);

module.exports = router;

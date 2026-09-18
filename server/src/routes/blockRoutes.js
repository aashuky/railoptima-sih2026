const express = require("express");

const router = express.Router();

const { getBlocksList } = require("../controllers/blocksController");

router.get("/", getBlocksList);

module.exports = router;
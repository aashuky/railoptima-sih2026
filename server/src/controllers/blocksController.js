const db = require("../db");
const asyncHandler = require("../middleware/asyncHandler");
const { success } = require("../utils/response");

const getBlocksList = asyncHandler(async (req, res) => {
  let blocks = db.getBlocks();
  const { corridor, status } = req.query;

  if (corridor) blocks = blocks.filter((b) => b.corridor.toLowerCase() === corridor.toLowerCase());
  if (status) blocks = blocks.filter((b) => b.status.toLowerCase() === status.toLowerCase());

  return success(res, 200, { count: blocks.length, blocks });
});

module.exports = { getBlocksList };

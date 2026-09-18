const db = require("../db");
const asyncHandler = require("../middleware/asyncHandler");
const { success } = require("../utils/response");

const getCorridorsList = asyncHandler(async (req, res) => {
  const corridors = db.getCorridors();
  return success(res, 200, { count: corridors.length, corridors });
});

module.exports = { getCorridorsList };

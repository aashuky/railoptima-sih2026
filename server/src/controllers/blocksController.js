const { getBlocks } = require("../data/seedData");

function getBlocksList(req, res) {
  try {
    let blocks = getBlocks();
    const { corridor, status } = req.query;

    if (corridor) {
      blocks = blocks.filter((b) => b.corridor.toLowerCase() === corridor.toLowerCase());
    }
    if (status) {
      blocks = blocks.filter((b) => b.status.toLowerCase() === status.toLowerCase());
    }

    return res.json({
      success: true,
      count: blocks.length,
      blocks
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blocks",
      error: error.message
    });
  }
}

module.exports = { getBlocksList };

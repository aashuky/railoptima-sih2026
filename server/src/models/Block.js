const { BLOCK_STATUS } = require("../config/constants");
const ApiError = require("../utils/ApiError");

/**
 * @typedef {Object} Block
 * @property {string} id
 * @property {string} corridor
 * @property {string} corridorName
 * @property {string} section
 * @property {string} date
 * @property {string} startTime
 * @property {string} endTime
 * @property {number} durationHours
 * @property {"Available"|"Scheduled"|"Closed"} status
 * @property {string[]} allowedDepartments
 * @property {string[]} assignedTasks
 * @property {string[]} departments
 */

function validateBlock(block) {
  const errors = [];
  if (!block || typeof block !== "object") {
    throw new ApiError(400, "Block must be an object");
  }
  if (!block.id) errors.push("id is required");
  if (!block.corridor) errors.push("corridor is required");
  if (block.status && !BLOCK_STATUS.includes(block.status)) {
    errors.push(`status must be one of: ${BLOCK_STATUS.join(", ")}`);
  }
  if (block.durationHours === undefined || Number(block.durationHours) <= 0) {
    errors.push("durationHours must be a positive number");
  }

  if (errors.length > 0) {
    throw new ApiError(400, "Invalid block data", errors);
  }
  return true;
}

module.exports = { validateBlock };

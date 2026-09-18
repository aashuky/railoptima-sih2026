const { DEPARTMENTS, PRIORITIES, TASK_STATUS } = require("../config/constants");
const ApiError = require("../utils/ApiError");

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {"TMS"|"SMMS"|"TDMS"} department
 * @property {string} departmentName
 * @property {string} title
 * @property {string} workType
 * @property {string} corridor
 * @property {string} corridorName
 * @property {string} section
 * @property {string} trackId
 * @property {number} durationHours
 * @property {"High"|"Medium"|"Low"} priority
 * @property {"Pending"|"Scheduled"|"Cancelled"} status
 */

function validateTask(task) {
  const errors = [];
  if (!task || typeof task !== "object") {
    throw new ApiError(400, "Task must be an object");
  }
  if (!task.id) errors.push("id is required");
  if (!task.department || !DEPARTMENTS[task.department]) {
    errors.push(`department must be one of: ${Object.keys(DEPARTMENTS).join(", ")}`);
  }
  if (!task.corridor) errors.push("corridor is required");
  if (!task.priority || !PRIORITIES.includes(task.priority)) {
    errors.push(`priority must be one of: ${PRIORITIES.join(", ")}`);
  }
  if (task.status && !TASK_STATUS.includes(task.status)) {
    errors.push(`status must be one of: ${TASK_STATUS.join(", ")}`);
  }
  if (task.durationHours === undefined || Number(task.durationHours) <= 0) {
    errors.push("durationHours must be a positive number");
  }

  if (errors.length > 0) {
    throw new ApiError(400, "Invalid task data", errors);
  }
  return true;
}

module.exports = { validateTask };

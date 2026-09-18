const db = require("../db");
const asyncHandler = require("../middleware/asyncHandler");
const { success } = require("../utils/response");

const getMaintenanceTasks = asyncHandler(async (req, res) => {
  let tasks = db.getTasks();
  const { department, status, corridor } = req.query;

  if (department) tasks = tasks.filter((t) => t.department.toLowerCase() === department.toLowerCase());
  if (status) tasks = tasks.filter((t) => t.status.toLowerCase() === status.toLowerCase());
  if (corridor) tasks = tasks.filter((t) => t.corridor.toLowerCase() === corridor.toLowerCase());

  return success(res, 200, { count: tasks.length, tasks });
});

module.exports = { getMaintenanceTasks };

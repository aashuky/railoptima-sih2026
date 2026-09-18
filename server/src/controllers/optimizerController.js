const db = require("../db");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const { validateOptimizeRequest } = require("../validators/optimizeValidator");
const { optimizeBlockSchedule } = require("../services/schedulerServices");
const runOptimizer = asyncHandler(async (req, res) => {
  const body = req.body || {};

  const validationErrors = validateOptimizeRequest(body);
  if (validationErrors.length > 0) {
    throw new ApiError(400, "Invalid request body", validationErrors);
  }

  const { taskIds } = body;
  const allTasks = db.getTasks();
  const allBlocks = db.getBlocks();

  const targetTasks =
    Array.isArray(taskIds) && taskIds.length > 0
      ? allTasks.filter((t) => taskIds.includes(t.id))
      : allTasks.filter((t) => t.status === "Pending");

  if (targetTasks.length === 0) {
    throw new ApiError(400, "No valid pending tasks found to optimize.");
  }

  const plan = optimizeBlockSchedule(targetTasks, allBlocks);

  if (!plan.success) {
    return res.status(422).json({
      success: false,
      message: plan.message,
      conflicts: plan.conflicts || []
    });
  }

  db.savePlan(plan);

  return res.status(200).json(plan);
});

module.exports = { runOptimizer };

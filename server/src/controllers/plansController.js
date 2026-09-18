const db = require("../db");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const { success } = require("../utils/response");

const approvePlan = asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const plan = db.findPlanById(planId);

  if (!plan) {
    throw new ApiError(404, `Plan with ID ${planId} not found or has expired. Please run optimize again.`);
  }

  const existingBlock = db.findBlockById(plan.blockId);
  if (existingBlock && existingBlock.status === "Scheduled") {
    // Original code had no guard here - re-approving the same plan would silently
    // re-run updateTask/updateBlock and could double-apply schedule state.
    throw new ApiError(409, `Block ${plan.blockId} has already been approved and scheduled.`);
  }

  const updatedTasks = [];
  (plan.assignedTasks || []).forEach((t) => {
    const updated = db.updateTask(t.id, {
      status: "Scheduled",
      assignedBlockId: plan.blockId,
      scheduledDate: plan.date,
      scheduledStartTime: plan.startTime,
      scheduledEndTime: plan.endTime
    });
    if (updated) updatedTasks.push(updated);
  });

  const taskIds = (plan.assignedTasks || []).map((t) => t.id);
  const depts = Array.from(new Set((plan.assignedTasks || []).map((t) => t.department)));

  const updatedBlock = db.updateBlock(plan.blockId, {
    status: "Scheduled",
    assignedTasks: taskIds,
    departments: depts,
    totalUtilizedHours: plan.totalDuration,
    approvedAt: new Date().toISOString()
  });

  return success(res, 200, {
    message: `Block Plan ${planId} approved successfully by Maintenance Controller. Registered in COA/BDMS for Block ${plan.blockId}.`,
    planId,
    blockId: plan.blockId,
    corridor: plan.corridor,
    scheduledTasksCount: updatedTasks.length,
    updatedTasks,
    updatedBlock
  });
});

const resetDemoData = asyncHandler(async (req, res) => {
  const result = db.resetData();
  const tasks = db.getTasks();
  const blocks = db.getBlocks();

  return success(res, 200, {
    message: result.message,
    taskCount: tasks.length,
    blockCount: blocks.length,
    timestamp: new Date().toISOString()
  });
});

module.exports = { approvePlan, resetDemoData };

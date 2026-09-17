const { getTasks, getBlocks, savePlan } = require("../data/seedData");
const { optimizeBlockSchedule } = require("../engine/scheduler");

function runOptimizer(req, res) {
  try {
    const { taskIds } = req.body || {};
    const allTasks = getTasks();
    const allBlocks = getBlocks();

    let targetTasks = [];
    if (Array.isArray(taskIds) && taskIds.length > 0) {
      targetTasks = allTasks.filter((t) => taskIds.includes(t.id));
    } else {
      // Default to pending tasks
      targetTasks = allTasks.filter((t) => t.status === "Pending");
    }

    if (targetTasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid pending tasks found to optimize."
      });
    }

    const plan = optimizeBlockSchedule(targetTasks, allBlocks);

    if (!plan.success) {
      return res.status(422).json({
        success: false,
        message: plan.message,
        conflicts: plan.conflicts || []
      });
    }

    // Save in-memory plan so it can be approved
    savePlan(plan);

    return res.json({
      success: true,
      planId: plan.planId,
      assignedTasks: plan.assignedTasks,
      unassignedTasks: plan.unassignedTasks,
      blockId: plan.blockId,
      corridor: plan.corridor,
      corridorName: plan.corridorName,
      section: plan.section,
      startTime: plan.startTime,
      endTime: plan.endTime,
      date: plan.date,
      totalDuration: plan.totalDuration,
      maxWindowHours: plan.maxWindowHours,
      compatibilityScore: plan.compatibilityScore,
      scoreBreakdown: plan.scoreBreakdown,
      reasons: plan.reasons,
      conflicts: plan.conflicts,
      explanation: plan.explanation,
      simulatedComparison: plan.simulatedComparison
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Optimization engine execution failed",
      error: error.message
    });
  }
}

module.exports = { runOptimizer };

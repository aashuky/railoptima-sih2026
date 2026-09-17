const {
  findPlanById,
  updateTask,
  updateBlock,
  resetData,
  getTasks,
  getBlocks
} = require("../data/seedData");

function approvePlan(req, res) {
  try {
    const { planId } = req.params;
    const plan = findPlanById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: `Plan with ID ${planId} not found or has expired. Please run optimize again.`
      });
    }

    // Mark assigned tasks as Scheduled
    const updatedTasks = [];
    (plan.assignedTasks || []).forEach((t) => {
      const updated = updateTask(t.id, {
        status: "Scheduled",
        assignedBlockId: plan.blockId,
        scheduledDate: plan.date,
        scheduledStartTime: plan.startTime,
        scheduledEndTime: plan.endTime
      });
      if (updated) updatedTasks.push(updated);
    });

    // Mark block as Scheduled
    const taskIds = (plan.assignedTasks || []).map((t) => t.id);
    const depts = Array.from(new Set((plan.assignedTasks || []).map((t) => t.department)));

    const updatedBlock = updateBlock(plan.blockId, {
      status: "Scheduled",
      assignedTasks: taskIds,
      departments: depts,
      totalUtilizedHours: plan.totalDuration,
      approvedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: `Block Plan ${planId} approved successfully by Maintenance Controller. Registered in COA/BDMS for Block ${plan.blockId}.`,
      planId,
      blockId: plan.blockId,
      corridor: plan.corridor,
      scheduledTasksCount: updatedTasks.length,
      updatedTasks,
      updatedBlock
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to approve block plan",
      error: error.message
    });
  }
}

function resetDemoData(req, res) {
  try {
    const result = resetData();
    const tasks = getTasks();
    const blocks = getBlocks();

    return res.json({
      success: true,
      message: result.message,
      taskCount: tasks.length,
      blockCount: blocks.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reset demo data",
      error: error.message
    });
  }
}

module.exports = { approvePlan, resetDemoData };

const db = require("../db");
const asyncHandler = require("../middleware/asyncHandler");
const { success } = require("../utils/response");

const getDashboardSummary = asyncHandler(async (req, res) => {
  const tasks = db.getTasks();
  const blocks = db.getBlocks();
  const corridors = db.getCorridors();

  const totalRequests = tasks.length;
  const pendingRequests = tasks.filter((t) => t.status === "Pending").length;
  const scheduledRequests = tasks.filter((t) => t.status === "Scheduled").length;

  const availableBlocks = blocks.filter((b) => b.status === "Available").length;
  const scheduledBlocks = blocks.filter((b) => b.status === "Scheduled").length;
  const totalBlocks = blocks.length;

  const departments = ["TMS", "SMMS", "TDMS"];
  const departmentBreakdown = {};

  departments.forEach((dept) => {
    const deptTasks = tasks.filter((t) => t.department === dept);
    const pending = deptTasks.filter((t) => t.status === "Pending").length;
    const scheduled = deptTasks.filter((t) => t.status === "Scheduled").length;
    departmentBreakdown[dept] = {
      name: dept === "TMS" ? "Track (Engineering)" : dept === "SMMS" ? "Signalling & Telecom" : "Traction Distribution (OHE)",
      count: deptTasks.length,
      pending,
      scheduled,
      percentOfTotal: totalRequests > 0 ? Math.round((deptTasks.length / totalRequests) * 100) : 0
    };
  });

  const priorityBreakdown = {
    High: tasks.filter((t) => t.priority === "High").length,
    Medium: tasks.filter((t) => t.priority === "Medium").length,
    Low: tasks.filter((t) => t.priority === "Low").length
  };

  const corridorSummary = corridors.map((c) => {
    const cTasks = tasks.filter((t) => t.corridor === c.id);
    const cBlocks = blocks.filter((b) => b.corridor === c.id);
    return {
      id: c.id,
      name: c.name,
      division: c.division,
      tasksCount: cTasks.length,
      pendingTasks: cTasks.filter((t) => t.status === "Pending").length,
      availableBlocks: cBlocks.filter((b) => b.status === "Available").length,
      scheduledBlocks: cBlocks.filter((b) => b.status === "Scheduled").length
    };
  });

  return success(res, 200, {
    summary: {
      totalRequests,
      pendingRequests,
      scheduledRequests,
      plannedBlocks: scheduledBlocks,
      availableBlocks,
      totalBlocks,
      departmentBreakdown,
      priorityBreakdown,
      corridorSummary
    }
  });
});

module.exports = { getDashboardSummary };

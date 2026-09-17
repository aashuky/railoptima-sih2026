const { getTasks } = require("../data/seedData");

function getMaintenanceTasks(req, res) {
  try {
    let tasks = getTasks();
    const { department, status, corridor } = req.query;

    if (department) {
      tasks = tasks.filter((t) => t.department.toLowerCase() === department.toLowerCase());
    }
    if (status) {
      tasks = tasks.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }
    if (corridor) {
      tasks = tasks.filter((t) => t.corridor.toLowerCase() === corridor.toLowerCase());
    }

    return res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance tasks",
      error: error.message
    });
  }
}

module.exports = { getMaintenanceTasks };

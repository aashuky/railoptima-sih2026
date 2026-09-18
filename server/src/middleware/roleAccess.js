const ApiError = require("../utils/ApiError");

const isPrivileged = (user) => user?.role === "controller" || user?.role === "admin";

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new ApiError(403, "You do not have permission to perform this operation."));
    }
    return next();
  };
}

function scopeTasks(tasks, user) {
  if (isPrivileged(user)) return tasks;
  return tasks.filter((task) => task.department === user?.department);
}

function scopeBlocks(blocks, user) {
  if (isPrivileged(user)) return blocks;
  return blocks.filter((block) => (block.allowedDepartments || []).includes(user?.department));
}

module.exports = { isPrivileged, requireRoles, scopeTasks, scopeBlocks };

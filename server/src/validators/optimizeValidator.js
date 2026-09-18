/**
 * Optimizer Request Validator
 */
function validateOptimizeRequest(body) {
  const errors = [];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    errors.push("Request body must be a JSON object");
    return errors;
  }

  if (body.taskIds !== undefined) {
    if (!Array.isArray(body.taskIds)) {
      errors.push("taskIds must be an array of task IDs");
    } else {
      const invalid = body.taskIds.some((id) => typeof id !== "string" || id.trim() === "");
      if (invalid) {
        errors.push("Each taskId must be a non-empty string");
      }
    }
  }

  return errors;
}

module.exports = { validateOptimizeRequest };

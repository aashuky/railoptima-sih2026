const { v4: uuidv4 } = require("uuid");

/**
 * Old code used `Date.now().toString().slice(-4)` which collides whenever
 * two optimize calls land in the same millisecond-truncated window.
 * A uuid slice keeps IDs short but removes the collision risk.
 */
function generatePlanId(blockId) {
  return `PLAN-${blockId}-${uuidv4().slice(0, 8).toUpperCase()}`;
}

module.exports = { generatePlanId };

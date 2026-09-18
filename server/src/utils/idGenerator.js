const crypto = require("crypto");

/**
 * Generates collision-resistant short plan IDs using Node.js built-in crypto.randomUUID().
 * Eliminates the external uuid package dependency.
 */
function generatePlanId(blockId) {
  const uuid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10);
  return `PLAN-${blockId}-${uuid.slice(0, 8).toUpperCase()}`;
}

module.exports = { generatePlanId };

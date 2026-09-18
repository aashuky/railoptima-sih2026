// Automated Backend Logic & Engine Test
const { getTasks, getBlocks, resetData } = require("./src/db");
const { calculateCompatibility } = require("./src/services/compatibilityService");
const { detectConflicts } = require("./src/services/conflictDetectorService");
const { optimizeBlockSchedule } = require("./src/services/schedulerServices");

console.log("--- 1. Testing Seed Data ---");
const tasks = getTasks();
const blocks = getBlocks();
console.log(`Loaded ${tasks.length} tasks, ${blocks.length} blocks.`);
const t1 = tasks.find((t) => t.id === "T001");
const t2 = tasks.find((t) => t.id === "T002");
const t3 = tasks.find((t) => t.id === "T003");
const blk1 = blocks.find((b) => b.id === "BLK-C01-01");

if (!t1 || !t2 || !t3 || !blk1) {
  console.error("FAIL: Missing required seed items T001, T002, T003, or BLK-C01-01");
  process.exit(1);
}
console.log("PASS: Required seed tasks and block verified.");

console.log("\n--- 2. Testing Compatibility Engine ---");
const compat = calculateCompatibility([t1, t2, t3], blk1);
console.log(`Score: ${compat.score}/100, isCompatible: ${compat.isCompatible}`);
console.log("Score Breakdown:", compat.breakdown);
console.log("Reasons:", compat.reasons);
if (compat.score < 90 || !compat.isCompatible) {
  console.error("FAIL: Expected high compatibility score (>= 90) for T001, T002, T003.");
  process.exit(1);
}
console.log("PASS: Compatibility engine test passed.");

console.log("\n--- 3. Testing Conflict Detector ---");
const t4 = tasks.find((t) => t.id === "T004"); // Corridor C02
const conflictCheck = detectConflicts([t1, t4], blk1);
console.log(`Conflicts detected: ${conflictCheck.conflicts.length}`);
conflictCheck.conflicts.forEach((c) => console.log(` - [${c.severity}] ${c.title}: ${c.description}`));
if (!conflictCheck.hasConflicts) {
  console.error("FAIL: Conflict detector should flag cross-corridor mismatch between T001 and T004.");
  process.exit(1);
}
console.log("PASS: Conflict detector properly caught corridor mismatch.");

console.log("\n--- 4. Testing Greedy Scheduler & Explainer ---");
const plan = optimizeBlockSchedule([t1, t2, t3], blocks);
console.log(`Plan ID: ${plan.planId}`);
console.log(`Assigned Tasks: ${plan.assignedTasks.map((t) => t.id).join(", ")}`);
console.log(`Total Duration: ${plan.totalDuration}h / ${plan.maxWindowHours}h`);
console.log(`Explanation: ${plan.explanation}`);
console.log("Simulated Comparison:", plan.simulatedComparison);
if (plan.assignedTasks.length !== 3 || plan.blockId !== "BLK-C01-01") {
  console.error("FAIL: Scheduler did not pack all 3 tasks into BLK-C01-01");
  process.exit(1);
}
console.log("PASS: Scheduler packed compatible tasks into single block with explanation.");

console.log("\n--- 5. Testing Reset Functionality ---");
const resetRes = resetData();
console.log("Reset result:", resetRes);
console.log("\nALL BACKEND ENGINE TESTS PASSED SUCCESSFULLY!");

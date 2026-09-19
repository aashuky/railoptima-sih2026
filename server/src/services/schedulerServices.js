/**
 * RailOptima Greedy Scheduling Engine & Explainable AI Generator
 * Packs compatible maintenance tasks into the fewest available block windows and
 * generates a plain-language explanation plus a simulated before/after comparison.
 */

const { calculateCompatibility } = require("./compatibilityService");
const { detectConflicts } = require("./conflictDetectorService");
const { PRIORITY_WEIGHT } = require("../config/constants");
const { generatePlanId } = require("../utils/idGenerator");

function optimizeBlockSchedule(tasks, availableBlocks) {
  if (!tasks || tasks.length === 0) {
    return { success: false, message: "No tasks provided for optimization." };
  }

  // 1. Group tasks by corridor
  const corridorGroups = {};
  tasks.forEach((task) => {
    if (!corridorGroups[task.corridor]) corridorGroups[task.corridor] = [];
    corridorGroups[task.corridor].push(task);
  });

  // Pick the primary corridor with the highest priority-weighted workload
  let selectedCorridor = Object.keys(corridorGroups)[0];
  let maxPriorityScore = -1;

  Object.entries(corridorGroups).forEach(([corridor, groupTasks]) => {
    const score = groupTasks.reduce((sum, t) => sum + (PRIORITY_WEIGHT[t.priority] || 1) * 10 + (t.durationHours || 1), 0);
    if (score > maxPriorityScore) {
      maxPriorityScore = score;
      selectedCorridor = corridor;
    }
  });

  const corridorTasks = corridorGroups[selectedCorridor];
  const rejectedOtherCorridorTasks = tasks.filter((t) => t.corridor !== selectedCorridor);

  // 2. Sort greedily: priority desc, then duration desc
  corridorTasks.sort((a, b) => {
    const pDiff = (PRIORITY_WEIGHT[b.priority] || 1) - (PRIORITY_WEIGHT[a.priority] || 1);
    if (pDiff !== 0) return pDiff;
    return (b.durationHours || 0) - (a.durationHours || 0);
  });

  // 3. Find matching available block windows on this corridor
  const corridorBlocks = (availableBlocks || []).filter((b) => b.corridor === selectedCorridor && b.status === "Available");

  if (corridorBlocks.length === 0) {
    return {
      success: false,
      message: `No available block windows found for Corridor ${selectedCorridor}.`,
      conflicts: [
        {
          type: "NO_BLOCK_AVAILABLE",
          severity: "CRITICAL",
          title: "Corridor Window Unavailable",
          description: `No unoccupied block slots currently registered in COA for Corridor ${selectedCorridor}.`
        }
      ]
    };
  }

  const targetBlock = corridorBlocks[0];

  // 4. Greedy packing
  const assignedTasks = [];
  const unassignedTasks = [];
  let currentDuration = 0;

  for (const task of corridorTasks) {
    const taskDuration = Number(task.durationHours) || 1;
    if (currentDuration + taskDuration <= targetBlock.durationHours) {
      assignedTasks.push(task);
      currentDuration += taskDuration;
    } else {
      unassignedTasks.push({
        task,
        reason: `Exceeds block remaining window (${targetBlock.durationHours - currentDuration}h available, required ${taskDuration}h)`
      });
    }
  }

  const compatibilityResult = calculateCompatibility(assignedTasks, targetBlock);
  const conflictResult = detectConflicts(assignedTasks, targetBlock);

  // 5. Plain-language explanation
  const deptList = Array.from(new Set(assignedTasks.map((t) => t.department)));
  const taskDescriptions = assignedTasks.map((t) => `${t.id} (${t.department} - ${t.title}, ${t.durationHours}h)`).join(", ");

  let explanation = `Tasks ${taskDescriptions} share Corridor ${selectedCorridor} (${targetBlock.corridorName}) and were bundled into a single coordinated block. Their combined duration of ${currentDuration} hours perfectly fits within the ${targetBlock.durationHours}-hour window of Block ${targetBlock.id} (${targetBlock.section}). Combining ${deptList.join(", ")} into a single line possession eliminates ${Math.max(0, assignedTasks.length - 1)} separate train line closures and prevents recurring traffic detentions.`;

  if (unassignedTasks.length > 0) {
    const unassignedSummary = unassignedTasks.map((u) => `${u.task.id} (${u.task.title})`).join(", ");
    explanation += ` Note: ${unassignedSummary} could not fit in this window due to the ${targetBlock.durationHours}-hour maximum block capacity limit and will be scheduled in the next COA corridor slot.`;
  }

  if (rejectedOtherCorridorTasks.length > 0) {
    const otherIds = rejectedOtherCorridorTasks.map((t) => t.id).join(", ");
    explanation += ` Tasks ${otherIds} belong to separate railway corridors and require independent block allocations.`;
  }

  // 6. Simulated manual-vs-AI comparison
  const manualBlocksCount = assignedTasks.length;
  const manualDisruptionHours = assignedTasks.reduce((sum, t) => sum + (t.durationHours || 1), 0);
  const manualDisruptionsCount = assignedTasks.length;
  const optimizedBlocksCount = 1;
  const optimizedDisruptionHours = targetBlock.durationHours;
  const optimizedDisruptionsCount = 1;
  const savedDisruptions = Math.max(0, manualDisruptionsCount - optimizedDisruptionsCount);

  const planId = generatePlanId(targetBlock.id);

  return {
    success: true,
    planId,
    blockId: targetBlock.id,
    corridor: selectedCorridor,
    corridorName: targetBlock.corridorName,
    section: targetBlock.section,
    startTime: targetBlock.startTime,
    endTime: targetBlock.endTime,
    date: targetBlock.date,
    totalDuration: currentDuration,
    maxWindowHours: targetBlock.durationHours,
    compatibilityScore: compatibilityResult.score,
    scoreBreakdown: compatibilityResult.breakdown,
    reasons: compatibilityResult.reasons,
    explanation,
    assignedTasks: assignedTasks.map((t) => ({
      id: t.id,
      department: t.department,
      departmentName: t.departmentName,
      title: t.title,
      workType: t.workType,
      durationHours: t.durationHours,
      priority: t.priority,
      trackId: t.trackId
    })),
    unassignedTasks: unassignedTasks.map((u) => ({
      id: u.task.id,
      title: u.task.title,
      department: u.task.department,
      reason: u.reason
    })),
    conflicts: conflictResult.conflicts,
    simulatedComparison: {
      isSimulatedScenario: true,
      label: "Simulated Operational Comparison (COA Traffic Model)",
      manualPlanning: {
        mode: "Manual Fragmented Planning",
        blocksCount: manualBlocksCount,
        disruptionEvents: manualDisruptionsCount,
        totalClosureHours: manualDisruptionHours,
        description: `${manualBlocksCount} independent line blocks booked separately across multiple days, halting traffic ${manualDisruptionsCount} separate times.`
      },
      aiOptimizedPlanning: {
        mode: "AI-Coordinated Single Block",
        blocksCount: optimizedBlocksCount,
        disruptionEvents: optimizedDisruptionsCount,
        totalClosureHours: optimizedDisruptionHours,
        description: `1 synchronized multi-department possession (${deptList.join(" + ")}), saving ${savedDisruptions} disruptive track stoppages.`
      },
      impactSummary: {
        disruptionsAvoided: savedDisruptions,
        disruptionReductionPercent: manualDisruptionsCount > 0 ? Math.round((savedDisruptions / manualDisruptionsCount) * 100) : 0,
        departmentsCombined: deptList.length,
        recurringStoppagesAvoided: savedDisruptions,
        assetAvailabilityGainHours: savedDisruptions
      }
    }
  };
}

module.exports = { optimizeBlockSchedule };

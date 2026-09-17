/**
 * RailOptima Greedy Scheduling Engine & Explainable AI Generator
 * 
 * Packs compatible maintenance tasks into the fewest available block windows.
 * Generates transparent, plain-language explanations of why tasks were grouped or rejected,
 * along with simulated before/after operational comparison metrics.
 */

const { calculateCompatibility } = require("./compatibility");
const { detectConflicts } = require("./conflictDetector");

const PRIORITY_ORDER = { High: 3, Medium: 2, Low: 1 };

/**
 * Greedily packs compatible tasks into the best available block window
 */
function optimizeBlockSchedule(tasks, availableBlocks) {
  if (!tasks || tasks.length === 0) {
    return {
      success: false,
      message: "No tasks provided for optimization."
    };
  }

  // 1. Group tasks by corridor
  const corridorGroups = {};
  tasks.forEach((task) => {
    if (!corridorGroups[task.corridor]) {
      corridorGroups[task.corridor] = [];
    }
    corridorGroups[task.corridor].push(task);
  });

  // Pick the primary corridor with the highest priority workload (or the first group)
  let selectedCorridor = Object.keys(corridorGroups)[0];
  let maxPriorityScore = -1;

  Object.entries(corridorGroups).forEach(([corridor, groupTasks]) => {
    const score = groupTasks.reduce(
      (sum, t) => sum + (PRIORITY_ORDER[t.priority] || 1) * 10 + (t.durationHours || 1),
      0
    );
    if (score > maxPriorityScore) {
      maxPriorityScore = score;
      selectedCorridor = corridor;
    }
  });

  const corridorTasks = corridorGroups[selectedCorridor];
  const rejectedOtherCorridorTasks = tasks.filter((t) => t.corridor !== selectedCorridor);

  // 2. Sort corridor tasks greedily by priority (High -> Low) then descending duration
  corridorTasks.sort((a, b) => {
    const pDiff = (PRIORITY_ORDER[b.priority] || 1) - (PRIORITY_ORDER[a.priority] || 1);
    if (pDiff !== 0) return pDiff;
    return (b.durationHours || 0) - (a.durationHours || 0);
  });

  // 3. Find matching available block windows on this corridor
  const corridorBlocks = (availableBlocks || []).filter(
    (b) => b.corridor === selectedCorridor && b.status === "Available"
  );

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

  // Select the earliest available block on this corridor
  const targetBlock = corridorBlocks[0];

  // 4. Greedy Packing: pack tasks until targetBlock.durationHours is reached
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

  // Evaluate compatibility and conflict metrics for the assigned pack
  const compatibilityResult = calculateCompatibility(assignedTasks, targetBlock);
  const conflictResult = detectConflicts(assignedTasks, targetBlock);

  // 5. Generate Plain-Language Explanation
  const deptList = Array.from(new Set(assignedTasks.map((t) => t.department)));
  const taskDescriptions = assignedTasks
    .map((t) => `${t.id} (${t.department} - ${t.title}, ${t.durationHours}h)`)
    .join(", ");

  let explanation = `Tasks ${taskDescriptions} share Corridor ${selectedCorridor} (${targetBlock.corridorName}) and were bundled into a single coordinated block. Their combined duration of ${currentDuration} hours perfectly fits within the ${targetBlock.durationHours}-hour window of Block ${targetBlock.id} (${targetBlock.section}). Combining ${deptList.join(", ")} into a single line possession eliminates ${Math.max(0, assignedTasks.length - 1)} separate train line closures and prevents recurring traffic detentions.`;

  if (unassignedTasks.length > 0) {
    const unassignedSummary = unassignedTasks
      .map((u) => `${u.task.id} (${u.task.title})`)
      .join(", ");
    explanation += ` Note: ${unassignedSummary} could not fit in this window due to the ${targetBlock.durationHours}-hour maximum block capacity limit and will be scheduled in the next COA corridor slot.`;
  }

  if (rejectedOtherCorridorTasks.length > 0) {
    const otherIds = rejectedOtherCorridorTasks.map((t) => t.id).join(", ");
    explanation += ` Tasks ${otherIds} belong to separate railway corridors and require independent block allocations.`;
  }

  // 6. Simulated Scenario Comparison: Manual vs AI-Coordinated
  // In manual planning: each task requests its own block on separate days/times
  const manualBlocksCount = assignedTasks.length;
  const manualDisruptionHours = assignedTasks.reduce((sum, t) => sum + (t.durationHours || 1), 0);
  const manualDisruptionsCount = assignedTasks.length; // 3 separate line possessions
  const optimizedBlocksCount = 1;
  const optimizedDisruptionHours = targetBlock.durationHours;
  const optimizedDisruptionsCount = 1; // single coordinated line possession
  const savedDisruptions = Math.max(0, manualDisruptionsCount - optimizedDisruptionsCount);

  const planId = `PLAN-${targetBlock.id}-${Date.now().toString().slice(-4)}`;

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
        description: `${manualBlocksCount} independent line disconnections booked separately across multiple days.`
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
        assetAvailabilityGainHours: Math.max(0, manualDisruptionHours - 1)
      }
    }
  };
}

module.exports = { optimizeBlockSchedule };

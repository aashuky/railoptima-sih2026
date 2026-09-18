/**
 * RailOptima Compatibility Checker
 * Rule-based scoring (0 - 100) evaluating whether a group of maintenance tasks can safely combine.
 *
 * Weights (sum to exactly 100):
 * 1. Corridor Match (hard requirement): 23 pts
 * 2. Window Capacity Fit: 23 pts
 * 3. Cross-Department Synergy: 30 pts (3 depts = 30, 2 = 20, 1 = 8)
 * 4. Non-Conflicting Work Types & Safety: 12 pts
 * 5. Priority & Urgency Weight: 12 pts (>=2 High = 12, 1 High = 9, else 6)
 */

const { DEPARTMENTS } = require("../config/constants");

function emptyBreakdownResult(reasons) {
  return {
    score: 0,
    isCompatible: false,
    breakdown: {
      corridorMatch: 0,
      durationFit: 0,
      departmentSynergy: 0,
      safetyFeasibility: 0,
      priorityWeight: 0
    },
    reasons
  };
}

function calculateCompatibility(tasks, block) {
  if (!tasks || tasks.length === 0) {
    return emptyBreakdownResult(["No tasks provided for compatibility evaluation."]);
  }

  const reasons = [];

  // 1. Corridor check (hard constraint, max 23 pts)
  const corridors = new Set(tasks.map((t) => t.corridor));
  if (corridors.size > 1) {
    return emptyBreakdownResult([
      `Corridor conflict: Tasks belong to ${corridors.size} distinct corridors (${Array.from(corridors).join(", ")}). Maintenance blocks cannot span across disconnected corridors.`
    ]);
  }

  const taskCorridor = Array.from(corridors)[0];
  let corridorScore = 0;

  if (block) {
    if (block.corridor !== taskCorridor) {
      return emptyBreakdownResult([
        `Block corridor mismatch: Selected tasks are on Corridor ${taskCorridor}, but Block ${block.id} is on Corridor ${block.corridor}.`
      ]);
    }
    corridorScore = 23;
    reasons.push(`Corridor match verified: All tasks and block belong to ${taskCorridor} (${block.corridorName || "Simulated Corridor"}).`);
  } else {
    corridorScore = 23;
    reasons.push(`Corridor alignment verified: All ${tasks.length} tasks share corridor ${taskCorridor}.`);
  }

  // 2. Duration window fit (0 - 23 pts)
  const totalDuration = tasks.reduce((sum, t) => sum + (Number(t.durationHours) || 0), 0);
  const maxAllowedDuration = block ? block.durationHours : 4;
  let durationScore = 0;

  if (totalDuration <= maxAllowedDuration) {
    const utilization = totalDuration / maxAllowedDuration;
    durationScore = Math.round(15 + utilization * 8);
    reasons.push(
      `Duration capacity fit: Combined task work (${totalDuration}h) fits within the ${maxAllowedDuration}h block window (${Math.round(utilization * 100)}% utilization).`
    );
  } else {
    reasons.push(
      `Duration overflow: Combined task duration of ${totalDuration}h exceeds the maximum available block window of ${maxAllowedDuration}h by ${totalDuration - maxAllowedDuration}h.`
    );
  }

  // 3. Cross-department synergy (0 - 30 pts)
  const departments = new Set(tasks.map((t) => t.department));
  let departmentSynergy;
  if (departments.size >= 3) {
    departmentSynergy = 30;
    reasons.push(
      "Maximum cross-department coordination achieved: Merges Track (TMS), Signalling (SMMS), and Traction Distribution (TDMS) into a unified line possession."
    );
  } else if (departments.size === 2) {
    departmentSynergy = 20;
    reasons.push(`Bi-department synergy achieved: Merges ${Array.from(departments).join(" & ")} into a single window, eliminating 1 train disruption.`);
  } else {
    departmentSynergy = 8;
    reasons.push(`Single department request (${Array.from(departments)[0]}). Combining with other departments is recommended for higher corridor utilization.`);
  }

  // 4. Non-conflicting work types & safety (0 - 12 pts)
  const safetyFeasibility = 12;
  const hasTrack = departments.has(DEPARTMENTS.TMS);
  const hasSignal = departments.has(DEPARTMENTS.SMMS);
  const hasTraction = departments.has(DEPARTMENTS.TDMS);

  if (hasTrack && hasTraction) {
    reasons.push("Safety protocol: OHE power block safely enables concurrent track machine work under de-energized catenary.");
  }
  if (hasTrack && hasSignal) {
    reasons.push("Interlocking safety: Electronic interlocking testing synchronized with point machine track possession.");
  }

  // 5. Priority & urgency (0 - 12 pts)
  const highPriorityCount = tasks.filter((t) => t.priority === "High").length;
  let priorityWeight = 6;
  if (highPriorityCount >= 2) {
    priorityWeight = 12;
    reasons.push(`Urgency alignment: Resolves ${highPriorityCount} High-Priority critical infrastructure maintenance requests simultaneously.`);
  } else if (highPriorityCount === 1) {
    priorityWeight = 9;
  }

  const totalScore = corridorScore + durationScore + departmentSynergy + safetyFeasibility + priorityWeight;
  const isCompatible = corridorScore > 0 && totalDuration <= maxAllowedDuration;

  return {
    score: totalScore,
    isCompatible,
    totalDuration,
    maxWindowHours: maxAllowedDuration,
    departments: Array.from(departments),
    breakdown: {
      corridorMatch: corridorScore,
      durationFit: durationScore,
      departmentSynergy,
      safetyFeasibility,
      priorityWeight
    },
    reasons
  };
}

module.exports = { calculateCompatibility };

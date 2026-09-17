/**
 * RailOptima Conflict Detector
 * Flags operational, spatial, temporal, and safety conflicts across maintenance tasks and block corridors.
 */

function detectConflicts(tasks, block) {
  const conflicts = [];

  if (!tasks || tasks.length === 0) {
    return {
      hasConflicts: false,
      conflicts: []
    };
  }

  // 1. Spatial Corridor Conflict
  const corridorMap = new Map();
  tasks.forEach((task) => {
    if (!corridorMap.has(task.corridor)) {
      corridorMap.set(task.corridor, []);
    }
    corridorMap.get(task.corridor).push(task.id);
  });

  if (corridorMap.size > 1) {
    const details = [];
    corridorMap.forEach((ids, corr) => {
      details.push(`Corridor ${corr} (Tasks: ${ids.join(", ")})`);
    });
    conflicts.push({
      type: "CORRIDOR_MISMATCH",
      severity: "CRITICAL",
      title: "Cross-Corridor Mismatch",
      description: `Tasks span across ${corridorMap.size} isolated rail corridors: ${details.join(" vs. ")}. Physical blocks can only be granted on a contiguous corridor segment.`
    });
  }

  // 2. Block Corridor Alignment
  if (block) {
    tasks.forEach((task) => {
      if (task.corridor !== block.corridor) {
        conflicts.push({
          type: "BLOCK_CORRIDOR_MISMATCH",
          severity: "CRITICAL",
          title: "Block Window Corridor Mismatch",
          description: `Task ${task.id} (${task.title}) belongs to Corridor ${task.corridor}, but target Block ${block.id} is reserved on Corridor ${block.corridor}.`
        });
      }
    });

    // 3. Temporal Duration Overflow
    const totalDuration = tasks.reduce((sum, t) => sum + (Number(t.durationHours) || 0), 0);
    if (totalDuration > block.durationHours) {
      conflicts.push({
        type: "DURATION_OVERFLOW",
        severity: "HIGH",
        title: "Block Duration Capacity Exceeded",
        description: `Combined task work requires ${totalDuration} hours, which exceeds available block window capacity of ${block.durationHours} hours by ${totalDuration - block.durationHours} hour(s). Trains cannot be detained beyond approved COA block margins.`
      });
    }
  }

  // 4. Duplicate Department Redundancy or Overlapping Track IDs
  const sectionTracks = new Map();
  tasks.forEach((task) => {
    const key = `${task.corridor}-${task.trackId || "DEFAULT"}`;
    if (!sectionTracks.has(key)) {
      sectionTracks.set(key, []);
    }
    sectionTracks.get(key).push(task);
  });

  sectionTracks.forEach((taskList, trackKey) => {
    if (taskList.length > 3) {
      conflicts.push({
        type: "TRACK_CONGESTION",
        severity: "WARNING",
        title: "High Track Work Density",
        description: `${taskList.length} concurrent maintenance activities scheduled on track section ${trackKey}. Ensure adequate clearance spacing between heavy machinery.`
      });
    }
  });

  return {
    hasConflicts: conflicts.length > 0,
    conflicts
  };
}

module.exports = { detectConflicts };

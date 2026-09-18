const config = require("../config");

function buildPrompt(plan) {
  return `You are RailOptima's safety-focused railway planning explainer. Rewrite the verified scheduling result below for a railway controller.

Rules:
- Use only the supplied facts. Never invent timings, safety approvals, or operational permissions.
- Explain why the tasks fit together, what the compatibility score means, and any conflicts or unassigned work.
- Be concise: 2 short paragraphs followed by 3 bullet points maximum.
- State clearly that the deterministic rule engine remains the decision authority and this is an explanation aid.
- Do not use markdown headings.

Verified scheduling result:
${JSON.stringify({
    blockId: plan.blockId,
    corridor: plan.corridor,
    section: plan.section,
    date: plan.date,
    totalDuration: plan.totalDuration,
    maxWindowHours: plan.maxWindowHours,
    compatibilityScore: plan.compatibilityScore,
    scoreBreakdown: plan.scoreBreakdown,
    assignedTasks: plan.assignedTasks,
    unassignedTasks: plan.unassignedTasks,
    conflicts: plan.conflicts,
    ruleExplanation: plan.explanation
  }, null, 2)}`;
}

async function generateGeminiExplanation(plan) {
  if (!config.gemini.apiKey) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.gemini.timeoutMs);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent?key=${encodeURIComponent(config.gemini.apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(plan) }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 500 }
        }),
        signal: controller.signal
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error?.message || `Gemini request failed with status ${response.status}`);
    }

    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    if (!text) {
      throw new Error("Gemini returned an empty explanation.");
    }

    return text;
  } finally {
    clearTimeout(timeout);
  }
}

function generateRuleBasedExplanation(plan) {
  const assigned = (plan.assignedTasks || []).map((task) => `${task.id} (${task.department})`).join(", ");
  const unassigned = (plan.unassignedTasks || []).map((task) => task.id).join(", ");
  const score = plan.compatibilityScore ?? plan.score ?? 0;
  const assignmentText = assigned || "No tasks were assigned";
  const overflowText = unassigned ? ` Unassigned work remains: ${unassigned}.` : " All selected work was assigned.";

  return `The verified rule engine assigned ${assignmentText} to block ${plan.blockId} on corridor ${plan.corridor}. The combined duration is ${plan.totalDuration} hours within the ${plan.maxWindowHours}-hour window, producing a compatibility score of ${score}/100.${overflowText}\n\nThis explanation is generated from the verified scheduling facts and is advisory only. The deterministic safety and compatibility rules remain the decision authority.\n\n- Corridor and block alignment were checked before assignment.\n- Department coordination was scored across TMS, SMMS, and TDMS work.\n- Controllers should complete the operational possession and isolation checks before approval.`;
}

module.exports = { generateGeminiExplanation, generateRuleBasedExplanation };

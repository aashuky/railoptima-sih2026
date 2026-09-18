const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const { requireAuth } = require("../middleware/requireAuth");
const { generateGeminiExplanation, generateRuleBasedExplanation } = require("../services/geminiService");
const config = require("../config");

const router = express.Router();

router.post("/explain", requireAuth, asyncHandler(async (req, res) => {
  const plan = req.body?.plan;
  if (!plan || typeof plan !== "object" || !plan.explanation) {
    throw new ApiError(400, "A generated optimization plan is required.");
  }

  let explanation;
  let provider = "rule-engine";
  try {
    explanation = await generateGeminiExplanation(plan);
    if (explanation) provider = "gemini";
  } catch (error) {
    explanation = generateRuleBasedExplanation(plan);
  }
  if (!explanation) explanation = generateRuleBasedExplanation(plan);

  return res.json({ success: true, provider, model: provider === "gemini" ? config.gemini.model : "verified-rule-engine", explanation });
}));

module.exports = router;

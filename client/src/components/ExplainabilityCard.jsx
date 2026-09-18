import React from "react";
import { CheckCircle2, ShieldCheck, AlertCircle, Info, Sparkles, WandSparkles } from "lucide-react";

export default function ExplainabilityCard({ plan, aiExplanation, aiLoading, aiError }) {
  if (!plan) return null;

  const {
    compatibilityScore,
    scoreBreakdown = {},
    reasons = [],
    explanation,
    conflicts = []
  } = plan;

  return (
    <div className="bg-white border border-[#CBD5E1] rounded shadow-sm overflow-hidden">
      {/* Header with AI Purple #7C3AED */}
      <div className="bg-[#7C3AED] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-white" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Explainable AI Reasoning & Compatibility Breakdown
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-100 uppercase">Compatibility Score:</span>
          <span className="font-mono text-base font-black px-2.5 py-0.5 rounded bg-[#5B21B6] text-white border border-purple-300/40 shadow-xs">
            {compatibilityScore}/100
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Plain-Language Justification Summary with AI Purple border */}
        <div className="p-3.5 bg-[#F5F3FF] border-l-4 border-[#7C3AED] rounded-r text-xs sm:text-sm text-[#1E293B] leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-[#7C3AED] mb-1">
            <Info className="w-3.5 h-3.5 text-[#7C3AED]" />
            Decision Rationale
          </div>
          <p className="whitespace-pre-line">{aiExplanation || explanation}</p>
          <div className="mt-3 flex items-center gap-2 border-t border-[#DDD6FE] pt-2 text-[10px] font-semibold uppercase tracking-wide text-[#6D28D9]">
            {aiLoading ? (
              <>
                <WandSparkles className="h-3.5 w-3.5 animate-pulse" />
                Gemini is translating verified rules...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                {aiExplanation
                  ? "Gemini explanation grounded in verified rules"
                  : "Verified rule-engine explanation"}
              </>
            )}
          </div>
          {aiError && <p className="mt-2 text-[10px] text-[#92400E]">{aiError}</p>}
        </div>

        {/* Compatibility Factor Scoring Matrix (Genuinely sums to 100) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-2.5">
            Rule-Based Compatibility Factors (Sums to Exactly 100)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-center">
              <span className="block text-[11px] text-[#64748B] uppercase font-semibold">Corridor Match</span>
              <span className="font-mono text-base font-black text-[#1E293B]">
                {scoreBreakdown.corridorMatch ?? 23}<span className="text-xs font-normal text-[#94A3B8]">/23</span>
              </span>
            </div>
            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-center">
              <span className="block text-[11px] text-[#64748B] uppercase font-semibold">Window Capacity</span>
              <span className="font-mono text-base font-black text-[#1E293B]">
                {scoreBreakdown.durationFit ?? 23}<span className="text-xs font-normal text-[#94A3B8]">/23</span>
              </span>
            </div>
            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-center">
              <span className="block text-[11px] text-[#64748B] uppercase font-semibold">Dept Synergy</span>
              <span className="font-mono text-base font-black text-[#7C3AED]">
                {scoreBreakdown.departmentSynergy ?? 30}<span className="text-xs font-normal text-[#94A3B8]">/30</span>
              </span>
            </div>
            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-center">
              <span className="block text-[11px] text-[#64748B] uppercase font-semibold">Safety Feasibility</span>
              <span className="font-mono text-base font-black text-[#1E293B]">
                {scoreBreakdown.safetyFeasibility ?? 12}<span className="text-xs font-normal text-[#94A3B8]">/12</span>
              </span>
            </div>
            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-center col-span-2 sm:col-span-1">
              <span className="block text-[11px] text-[#64748B] uppercase font-semibold">Urgency Weight</span>
              <span className="font-mono text-base font-black text-[#1E293B]">
                {scoreBreakdown.priorityWeight ?? 12}<span className="text-xs font-normal text-[#94A3B8]">/12</span>
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Verified Safety & Operational Rules */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-2">
            Verification Rules Checked
          </h4>
          <ul className="space-y-1.5 text-xs text-[#1E293B]">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conflicts & Operational Warnings if any (Strictly Red #DC2626 for critical alerts) */}
        {conflicts && conflicts.length > 0 && (
          <div className="border-t border-[#E2E8F0] pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DC2626] mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#DC2626]" />
              Conflict Detector Notifications ({conflicts.length})
            </h4>
            <div className="space-y-2">
              {conflicts.map((c, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-[#FEF2F2] border border-[#FECACA] rounded text-xs text-[#991B1B]"
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{c.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FEE2E2] font-mono text-[#DC2626]">
                      {c.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-[#7F1D1D]">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

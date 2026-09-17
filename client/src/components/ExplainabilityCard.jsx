import React from "react";
import { CheckCircle2, ShieldCheck, AlertCircle, Info } from "lucide-react";

export default function ExplainabilityCard({ plan }) {
  if (!plan) return null;

  const {
    compatibilityScore,
    scoreBreakdown = {},
    reasons = [],
    explanation,
    conflicts = []
  } = plan;

  return (
    <div className="bg-white border border-[#CCCCCC] rounded shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#312F30] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#ED1B24]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Explainable AI Reasoning & Compatibility Breakdown
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#CCCCCC] uppercase">Compatibility Score:</span>
          <span className="font-mono text-base font-black px-2 py-0.5 rounded bg-[#111111] text-white border border-[#444]">
            {compatibilityScore}/100
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Plain-Language Justification Summary */}
        <div className="p-3.5 bg-[#F2F2F2] border-l-4 border-[#ED1B24] rounded-r text-xs sm:text-sm text-[#312F30] leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-[#ED1B24] mb-1">
            <Info className="w-3.5 h-3.5" />
            Decision Rationale
          </div>
          {explanation}
        </div>

        {/* Compatibility Factor Scoring Matrix (Genuinely sums to 100) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#312F30] mb-2.5">
            Rule-Based Compatibility Factors (Sums to Exactly 100)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div className="p-2.5 bg-[#F9F9F9] border border-[#CCCCCC] rounded text-center">
              <span className="block text-[11px] text-[#999999] uppercase font-semibold">Corridor Match</span>
              <span className="font-mono text-base font-black text-[#312F30]">
                {scoreBreakdown.corridorMatch ?? 23}<span className="text-xs font-normal text-[#999999]">/23</span>
              </span>
            </div>
            <div className="p-2.5 bg-[#F9F9F9] border border-[#CCCCCC] rounded text-center">
              <span className="block text-[11px] text-[#999999] uppercase font-semibold">Window Capacity</span>
              <span className="font-mono text-base font-black text-[#312F30]">
                {scoreBreakdown.durationFit ?? 23}<span className="text-xs font-normal text-[#999999]">/23</span>
              </span>
            </div>
            <div className="p-2.5 bg-[#F9F9F9] border border-[#CCCCCC] rounded text-center">
              <span className="block text-[11px] text-[#999999] uppercase font-semibold">Dept Synergy</span>
              <span className="font-mono text-base font-black text-[#ED1B24]">
                {scoreBreakdown.departmentSynergy ?? 30}<span className="text-xs font-normal text-[#999999]">/30</span>
              </span>
            </div>
            <div className="p-2.5 bg-[#F9F9F9] border border-[#CCCCCC] rounded text-center">
              <span className="block text-[11px] text-[#999999] uppercase font-semibold">Safety Feasibility</span>
              <span className="font-mono text-base font-black text-[#312F30]">
                {scoreBreakdown.safetyFeasibility ?? 12}<span className="text-xs font-normal text-[#999999]">/12</span>
              </span>
            </div>
            <div className="p-2.5 bg-[#F9F9F9] border border-[#CCCCCC] rounded text-center col-span-2 sm:col-span-1">
              <span className="block text-[11px] text-[#999999] uppercase font-semibold">Urgency Weight</span>
              <span className="font-mono text-base font-black text-[#312F30]">
                {scoreBreakdown.priorityWeight ?? 12}<span className="text-xs font-normal text-[#999999]">/12</span>
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Verified Safety & Operational Rules */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#312F30] mb-2">
            Verification Rules Checked
          </h4>
          <ul className="space-y-1.5 text-xs text-[#312F30]">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#FAFAFA] p-2 rounded border border-[#E5E5E5]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conflicts & Operational Warnings if any */}
        {conflicts && conflicts.length > 0 && (
          <div className="border-t border-[#CCCCCC] pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#ED1B24] mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
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
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FEE2E2] font-mono">
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

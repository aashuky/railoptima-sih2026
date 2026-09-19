import React from "react";
import { ArrowRight, TrendingDown, Clock, GitCommit, AlertTriangle, CheckCircle } from "lucide-react";

export default function SimulatedComparison({ comparison }) {
  if (!comparison) return null;

  const { manualPlanning, aiOptimizedPlanning, impactSummary } = comparison;

  return (
    <div className="bg-white border border-[#CBD5E1] rounded shadow-sm overflow-hidden">
      {/* Simulation Scenario Notice Bar */}
      <div className="bg-[#071F4D] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#0B3D91]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1976D2]"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
            Simulated Operational Scenario
          </span>
        </div>
        <span className="text-[11px] text-[#94A3B8] uppercase font-mono">
          Model: Control Office Application (COA) Disruption Simulation
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {/* Before: Manual Planning (Amber/Warning) */}
          <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded relative">
            <div className="flex items-center justify-between pb-2 border-b border-[#FDE68A]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#92400E]">
                <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                Before: Manual Fragmented Planning
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold">
                Legacy BDMS
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#78350F]">Block Bookings Required:</span>
                <span className="font-mono font-bold text-sm text-[#92400E]">
                  {manualPlanning.blocksCount} Separate Blocks
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#78350F]">Train Traffic Disruption Events:</span>
                <span className="font-mono font-bold text-sm text-[#92400E]">
                  {manualPlanning.disruptionEvents} Separate Line Closures
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#78350F]">Total Line Block Duration:</span>
                <span className="font-mono font-bold text-sm text-[#92400E]">
                  {manualPlanning.totalClosureHours} Hours (Cumulative)
                </span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-[#92400E] leading-relaxed border-t border-[#FDE68A] pt-2">
              {manualPlanning.description}
            </p>
          </div>

          {/* After: AI-Coordinated Plan (Green/Success) */}
          <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded relative">
            <div className="flex items-center justify-between pb-2 border-b border-[#BBF7D0]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#166534]">
                <CheckCircle className="w-4 h-4 text-[#16A34A]" />
                After: AI-Coordinated Schedule
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DCFCE7] text-[#166534] font-bold">
                RailOptima
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#14532D]">Block Bookings Required:</span>
                <span className="font-mono font-bold text-sm text-emerald-700">
                  {aiOptimizedPlanning.blocksCount} Consolidated Block
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#14532D]">Train Traffic Disruption Events:</span>
                <span className="font-mono font-bold text-sm text-emerald-700">
                  {aiOptimizedPlanning.disruptionEvents} Single Line Closure
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#14532D]">Total Line Block Duration:</span>
                <span className="font-mono font-bold text-sm text-emerald-700">
                  {aiOptimizedPlanning.totalClosureHours} Hours (Single Window)
                </span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-[#14532D] leading-relaxed border-t border-[#BBF7D0] pt-2">
              {aiOptimizedPlanning.description}
            </p>
          </div>
        </div>

        {/* Operational Outcome Strip (Deep Railway Blue) */}
        <div className="mt-4 bg-[#0B3D91] text-white p-3 rounded flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-sky-300" />
            <span className="font-bold uppercase tracking-wider text-[#E2E8F0]">
              Traffic Disruption Reduction:
            </span>
            <span className="font-mono font-bold text-sm text-white">
              {impactSummary.disruptionsAvoided} Line Stoppages Avoided ({impactSummary.disruptionReductionPercent}% Fewer Disruptions)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="font-bold uppercase tracking-wider text-[#E2E8F0]">
              Multi-Department Synergy:
            </span>
            <span className="font-mono font-bold text-sm text-emerald-300">
              {impactSummary.departmentsCombined || 3} Departments Synchronized in 1 Window
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { ArrowRight, TrendingDown, Clock, GitCommit, AlertTriangle, CheckCircle } from "lucide-react";

export default function SimulatedComparison({ comparison }) {
  if (!comparison) return null;

  const { manualPlanning, aiOptimizedPlanning, impactSummary } = comparison;

  return (
    <div className="bg-white border border-[#CCCCCC] rounded shadow-sm overflow-hidden">
      {/* Simulation Scenario Notice Bar */}
      <div className="bg-[#1C1A1B] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#312F30]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ED1B24]"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#CCCCCC]">
            Simulated Operational Scenario
          </span>
        </div>
        <span className="text-[11px] text-[#999999] uppercase font-mono">
          Model: Control Office Application (COA) Disruption Simulation
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {/* Before: Manual Planning */}
          <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded relative">
            <div className="flex items-center justify-between pb-2 border-b border-[#FECACA]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#991B1B]">
                <AlertTriangle className="w-4 h-4 text-[#ED1B24]" />
                Before: Manual Fragmented Planning
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B] font-bold">
                Legacy BDMS
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#7F1D1D]">Separate Block Bookings:</span>
                <span className="font-mono font-bold text-sm text-[#991B1B]">
                  {manualPlanning.blocksCount} Blocks
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#7F1D1D]">Train Traffic Disruption Events:</span>
                <span className="font-mono font-bold text-sm text-[#991B1B]">
                  {manualPlanning.disruptionEvents} Separate Line Closures
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#7F1D1D]">Total Track Disconnection Time:</span>
                <span className="font-mono font-bold text-sm text-[#991B1B]">
                  {manualPlanning.totalClosureHours} Hours Cumulative
                </span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-[#991B1B] leading-relaxed border-t border-[#FECACA] pt-2">
              {manualPlanning.description}
            </p>
          </div>

          {/* After: AI-Coordinated Plan */}
          <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded relative">
            <div className="flex items-center justify-between pb-2 border-b border-[#BBF7D0]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#166534]">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                After: AI-Coordinated Schedule
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DCFCE7] text-[#166534] font-bold">
                RailOptima
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#14532D]">Consolidated Block Windows:</span>
                <span className="font-mono font-bold text-sm text-emerald-700">
                  {aiOptimizedPlanning.blocksCount} Unified Block
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#14532D]">Train Traffic Disruption Events:</span>
                <span className="font-mono font-bold text-sm text-emerald-700">
                  {aiOptimizedPlanning.disruptionEvents} Single Line Closure
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#14532D]">Possession Window Duration:</span>
                <span className="font-mono font-bold text-sm text-emerald-700">
                  {aiOptimizedPlanning.totalClosureHours} Hours Window
                </span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-[#14532D] leading-relaxed border-t border-[#BBF7D0] pt-2">
              {aiOptimizedPlanning.description}
            </p>
          </div>
        </div>

        {/* Operational Outcome Strip */}
        <div className="mt-4 bg-[#312F30] text-white p-3 rounded flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[#ED1B24]" />
            <span className="font-bold uppercase tracking-wider text-[#CCCCCC]">
              Traffic Disruption Reduction:
            </span>
            <span className="font-mono font-bold text-sm text-white">
              {impactSummary.disruptionsAvoided} Line Stoppages Avoided ({impactSummary.disruptionReductionPercent}% Fewer Disruptions)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="font-bold uppercase tracking-wider text-[#CCCCCC]">
              Corridor Availability Gain:
            </span>
            <span className="font-mono font-bold text-sm text-emerald-400">
              +{impactSummary.assetAvailabilityGainHours}h Available Track Time
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

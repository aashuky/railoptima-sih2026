import React, { useState, useEffect } from "react";
import { fetchBlocks, fetchMaintenanceTasks } from "../services/api";
import DepartmentBadge from "../components/DepartmentBadge";
import {
  CalendarDays,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function BlockPlans() {
  const [blocks, setBlocks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("weekly"); // 'weekly' or 'monthly'
  const [selectedCorridor, setSelectedCorridor] = useState("ALL");
  const [selectedWeek, setSelectedWeek] = useState(3); // Week 3 of Sept 2026 contains Sept 15-21 (our seed dates!)

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [blockData, taskData] = await Promise.all([
        fetchBlocks(),
        fetchMaintenanceTasks()
      ]);
      setBlocks(blockData.blocks || []);
      setTasks(taskData.tasks || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load block plans: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter blocks
  const filteredBlocks = blocks.filter((b) => {
    if (selectedCorridor !== "ALL" && b.corridor !== selectedCorridor) return false;
    return true;
  });

  // Helper for weeks in September 2026
  const WEEKS = [
    { num: 1, label: "Week 1: Sep 01 - Sep 07, 2026", start: 1, end: 7 },
    { num: 2, label: "Week 2: Sep 08 - Sep 14, 2026", start: 8, end: 14 },
    { num: 3, label: "Week 3: Sep 15 - Sep 21, 2026 (Active Intake)", start: 15, end: 21 },
    { num: 4, label: "Week 4: Sep 22 - Sep 28, 2026", start: 22, end: 28 },
    { num: 5, label: "Week 5: Sep 29 - Sep 30, 2026", start: 29, end: 30 }
  ];

  const currentWeekInfo = WEEKS.find((w) => w.num === selectedWeek) || WEEKS[2];

  // Filter blocks for weekly view
  const weeklyBlocks = filteredBlocks.filter((b) => {
    if (!b.date) return false;
    const day = parseInt(b.date.split("-")[2], 10);
    return day >= currentWeekInfo.start && day <= currentWeekInfo.end;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Horizon Switcher */}
      <div className="bg-[#111111] text-white p-6 rounded border border-[#312F30] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ED1B24]">
            <CalendarDays className="w-4 h-4" />
            Unified Engine Horizon View
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
            Corridor Block Plans & Timelines
          </h1>
          <p className="text-xs text-[#CCCCCC] mt-1 max-w-2xl">
            Single scheduling engine driving dual planning horizons: operational weekly execution
            and strategic monthly infrastructure possession coordination.
          </p>
        </div>

        {/* View Horizon Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="bg-[#1C1A1B] p-1 rounded border border-[#312F30] flex items-center gap-1">
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                viewMode === "weekly"
                  ? "bg-[#ED1B24] text-white shadow-xs"
                  : "text-[#999999] hover:text-white hover:bg-[#2A2829]"
              }`}
            >
              Weekly Horizon
            </button>
            <button
              onClick={() => setViewMode("monthly")}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                viewMode === "monthly"
                  ? "bg-[#ED1B24] text-white shadow-xs"
                  : "text-[#999999] hover:text-white hover:bg-[#2A2829]"
              }`}
            >
              Monthly Horizon
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Date Selector & Corridor Filter */}
      <div className="bg-white border border-[#CCCCCC] p-4 rounded shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Date Selector for Weekly View */}
        {viewMode === "weekly" ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-[#999999]">Date Range:</span>
            <div className="flex items-center gap-1">
              <button
                disabled={selectedWeek <= 1}
                onClick={() => setSelectedWeek((w) => Math.max(1, w - 1))}
                className="p-1 rounded border border-[#CCCCCC] hover:bg-[#F2F2F2] disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4 text-[#312F30]" />
              </button>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="bg-[#F9F9F9] border border-[#CCCCCC] rounded px-3 py-1.5 text-xs font-bold text-[#312F30]"
              >
                {WEEKS.map((w) => (
                  <option key={w.num} value={w.num}>
                    {w.label}
                  </option>
                ))}
              </select>
              <button
                disabled={selectedWeek >= 5}
                onClick={() => setSelectedWeek((w) => Math.min(5, w + 1))}
                className="p-1 rounded border border-[#CCCCCC] hover:bg-[#F2F2F2] disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4 text-[#312F30]" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-[#999999]">Month Horizon:</span>
            <span className="text-xs font-bold font-mono px-3 py-1.5 bg-[#F2F2F2] border border-[#CCCCCC] rounded text-[#312F30]">
              September 2026 (Complete Month View)
            </span>
          </div>
        )}

        {/* Corridor Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold uppercase text-[#999999]">Filter Corridor:</span>
          <select
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="bg-[#F9F9F9] border border-[#CCCCCC] rounded px-3 py-1.5 text-xs font-bold text-[#312F30]"
          >
            <option value="ALL">All Corridors ({filteredBlocks.length} Blocks)</option>
            <option value="C01">C01: Corridor C01 (Simulated Section Alpha–Beta)</option>
            <option value="C02">C02: Corridor C02 (Simulated Section Gamma–Delta)</option>
            <option value="C03">C03: Corridor C03 (Simulated Section Epsilon–Zeta)</option>
          </select>
        </div>
      </div>

      {/* Content Rendering: Weekly Horizon vs Monthly Horizon */}
      {viewMode === "weekly" ? (
        /* Weekly Horizon View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#312F30]">
              Weekly Coordinated Block Timeline ({weeklyBlocks.length} Block Slots in {currentWeekInfo.label.split(":")[0]})
            </h2>
            <span className="text-[11px] text-[#666666] font-mono">
              COA Synchronized
            </span>
          </div>

          {weeklyBlocks.length === 0 ? (
            <div className="bg-white border border-[#CCCCCC] rounded p-12 text-center text-xs text-[#999999]">
              No block windows scheduled in this weekly timeframe for the selected corridor.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeklyBlocks.map((block) => {
                const isScheduled = block.status === "Scheduled";
                return (
                  <div
                    key={block.id}
                    className={`bg-white border rounded shadow-sm overflow-hidden flex flex-col justify-between transition-all ${
                      isScheduled
                        ? "border-emerald-600 border-t-4"
                        : "border-[#CCCCCC] border-t-4 border-t-[#312F30]"
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="p-4 bg-[#FAFAFA] border-b border-[#E5E5E5] flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-sm text-[#312F30] block">
                            {block.id}
                          </span>
                          <span className="text-[11px] text-[#777777] font-semibold">
                            {block.corridor} • {block.section}
                          </span>
                        </div>
                        {isScheduled ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#F2F2F2] text-[#666666] border border-[#CCCCCC]">
                            <Clock className="w-3 h-3 text-[#999999]" />
                            Available
                          </span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[#888888]">Scheduled Date:</span>
                          <span className="font-mono font-bold text-[#312F30] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#ED1B24]" />
                            {block.date}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[#888888]">Possession Window:</span>
                          <span className="font-mono font-bold text-[#312F30]">
                            {block.durationHours} Hours (01:00 - 05:00 Window)
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[#888888]">Traffic Impact:</span>
                          <span className="font-medium text-[#444444]">
                            {block.trafficImpact}
                          </span>
                        </div>

                        {/* Participating Departments */}
                        <div className="pt-2 border-t border-[#F0F0F0]">
                          <span className="text-[11px] text-[#888888] block mb-1.5 font-semibold uppercase">
                            Participating Departments:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {isScheduled && block.departments && block.departments.length > 0 ? (
                              block.departments.map((dept) => (
                                <DepartmentBadge key={dept} department={dept} />
                              ))
                            ) : (
                              (block.allowedDepartments || []).map((dept) => (
                                <span
                                  key={dept}
                                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F2F2F2] text-[#666666] border border-[#E0E0E0]"
                                >
                                  {dept}
                                </span>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Assigned Tasks Summary */}
                        {isScheduled && block.assignedTasks && block.assignedTasks.length > 0 && (
                          <div className="pt-2 border-t border-[#F0F0F0]">
                            <span className="text-[11px] text-[#888888] block mb-1 font-semibold uppercase">
                              Bundled Tasks:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {block.assignedTasks.map((tId) => (
                                <span
                                  key={tId}
                                  className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EBF5FF] text-[#1E40AF] border border-[#BFDBFE]"
                                >
                                  {tId}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-4 py-2.5 bg-[#F9F9F9] border-t border-[#E5E5E5] text-[11px] text-[#777777] italic">
                      {block.description}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Monthly Horizon View */
        <div className="bg-white border border-[#CCCCCC] rounded shadow-sm overflow-hidden">
          <div className="bg-[#312F30] text-white px-4 py-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Monthly Corridor Maintenance Density Grid (September 2026)
            </h2>
            <span className="text-[11px] text-[#CCCCCC] font-mono">
              Total Managed Blocks: {filteredBlocks.length}
            </span>
          </div>

          <div className="p-4 sm:p-6 overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#CCCCCC]">
              <thead className="bg-[#F2F2F2] text-[#312F30] uppercase font-bold text-[11px] border-b border-[#CCCCCC]">
                <tr>
                  <th className="py-2.5 px-3 border-r border-[#CCCCCC]">Corridor</th>
                  <th className="py-2.5 px-3 border-r border-[#CCCCCC]">Block ID</th>
                  <th className="py-2.5 px-3 border-r border-[#CCCCCC]">Date</th>
                  <th className="py-2.5 px-3 border-r border-[#CCCCCC]">Window</th>
                  <th className="py-2.5 px-3 border-r border-[#CCCCCC]">Departments Involved</th>
                  <th className="py-2.5 px-3 border-r border-[#CCCCCC]">Status</th>
                  <th className="py-2.5 px-3">Traffic Regulation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filteredBlocks.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F9F9F9] transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#312F30] border-r border-[#E5E5E5]">
                      <div>{b.corridor}</div>
                      <div className="text-[10px] text-[#888888]">{b.corridorName}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#312F30] border-r border-[#E5E5E5]">
                      {b.id}
                    </td>
                    <td className="py-3 px-3 font-mono border-r border-[#E5E5E5]">
                      {b.date}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-center border-r border-[#E5E5E5]">
                      {b.durationHours}h
                    </td>
                    <td className="py-3 px-3 border-r border-[#E5E5E5]">
                      <div className="flex flex-wrap gap-1">
                        {(b.departments?.length > 0 ? b.departments : b.allowedDepartments || []).map((d) => (
                          <DepartmentBadge key={d} department={d} />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 border-r border-[#E5E5E5]">
                      {b.status === "Scheduled" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#F2F2F2] text-[#666666] border border-[#CCCCCC]">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-[#666666]">
                      {b.trafficImpact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

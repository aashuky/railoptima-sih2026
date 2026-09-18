import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  ChevronRight,
  CalendarX,
  RotateCcw
} from "lucide-react";

export default function BlockPlans() {
  const [blocks, setBlocks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("weekly"); // 'weekly' or 'monthly'
  const [selectedCorridor, setSelectedCorridor] = useState("ALL");
  const [selectedWeek, setSelectedWeek] = useState(3); // Week 3 of Sept 2026 contains Sept 15-21 (our seed dates!)

  const loadData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter blocks with useMemo
  const filteredBlocks = useMemo(() => {
    return blocks.filter((b) => {
      if (selectedCorridor !== "ALL" && b.corridor !== selectedCorridor) return false;
      return true;
    });
  }, [blocks, selectedCorridor]);

  // Helper for weeks in September 2026
  const WEEKS = useMemo(
    () => [
      { num: 1, label: "Week 1: Sep 01 - Sep 07, 2026", start: 1, end: 7 },
      { num: 2, label: "Week 2: Sep 08 - Sep 14, 2026", start: 8, end: 14 },
      { num: 3, label: "Week 3: Sep 15 - Sep 21, 2026 (Active Intake)", start: 15, end: 21 },
      { num: 4, label: "Week 4: Sep 22 - Sep 28, 2026", start: 22, end: 28 },
      { num: 5, label: "Week 5: Sep 29 - Sep 30, 2026", start: 29, end: 30 }
    ],
    []
  );

  const currentWeekInfo = useMemo(() => {
    return WEEKS.find((w) => w.num === selectedWeek) || WEEKS[2];
  }, [WEEKS, selectedWeek]);

  // Filter blocks for weekly view with useMemo
  const weeklyBlocks = useMemo(() => {
    return filteredBlocks.filter((b) => {
      if (!b.date) return false;
      const day = parseInt(b.date.split("-")[2], 10);
      return day >= currentWeekInfo.start && day <= currentWeekInfo.end;
    });
  }, [filteredBlocks, currentWeekInfo]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Horizon Switcher */}
      <div className="bg-[#071F4D] text-white p-6 rounded-md border border-[#0B3D91] flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1976D2]">
            <CalendarDays className="w-4 h-4 text-sky-300" />
            Unified Engine Horizon View
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
            Corridor Block Plans & Timelines
          </h1>
          <p className="text-xs text-[#CBD5E1] mt-1 max-w-2xl">
            Single scheduling engine driving dual planning horizons: operational weekly execution
            and strategic monthly infrastructure possession coordination.
          </p>
        </div>

        {/* View Horizon Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="bg-[#071F4D] p-1 rounded-md border border-[#0B3D91] flex items-center gap-1">
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                viewMode === "weekly"
                  ? "bg-[#1976D2] text-white shadow-xs"
                  : "text-[#CBD5E1] hover:text-white hover:bg-[#0B3D91]"
              }`}
            >
              Weekly Horizon
            </button>
            <button
              onClick={() => setViewMode("monthly")}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                viewMode === "monthly"
                  ? "bg-[#1976D2] text-white shadow-xs"
                  : "text-[#CBD5E1] hover:text-white hover:bg-[#0B3D91]"
              }`}
            >
              Monthly Horizon
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Date Selector & Corridor Filter */}
      <div className="bg-white border border-[#CBD5E1] p-4 rounded-md shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Date Selector for Weekly View */}
        {viewMode === "weekly" ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-[#64748B]">Date Range:</span>
            <div className="flex items-center gap-1">
              <button
                disabled={selectedWeek <= 1}
                onClick={() => setSelectedWeek((w) => Math.max(1, w - 1))}
                className="p-1 rounded-md border border-[#CBD5E1] hover:bg-[#F1F5F9] disabled:opacity-30 cursor-pointer transition-colors"
                title="Previous Week"
              >
                <ChevronLeft className="w-4 h-4 text-[#1E293B]" />
              </button>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-xs font-bold text-[#1E293B] focus:outline-hidden focus:ring-1 focus:ring-[#1976D2]"
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
                className="p-1 rounded-md border border-[#CBD5E1] hover:bg-[#F1F5F9] disabled:opacity-30 cursor-pointer transition-colors"
                title="Next Week"
              >
                <ChevronRight className="w-4 h-4 text-[#1E293B]" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-[#64748B]">Month Horizon:</span>
            <span className="text-xs font-bold font-mono px-3 py-1.5 bg-[#F1F5F9] border border-[#CBD5E1] rounded-md text-[#1E293B]">
              September 2026 (Complete Month View)
            </span>
          </div>
        )}

        {/* Corridor Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold uppercase text-[#64748B]">Filter Corridor:</span>
          <select
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-xs font-bold text-[#1E293B] focus:outline-hidden focus:ring-1 focus:ring-[#1976D2]"
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              Weekly Coordinated Block Timeline ({weeklyBlocks.length} Block Slots in {currentWeekInfo.label.split(":")[0]})
            </h2>
            <span className="text-[11px] text-[#64748B] font-mono">
              COA Synchronized
            </span>
          </div>

          {loading ? (
            // 3 Skeleton Timeline Cards during fetch
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-[#CBD5E1] rounded-md shadow-sm overflow-hidden p-4 space-y-4 animate-pulse"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <div className="space-y-1">
                      <div className="h-4 w-16 bg-[#CBD5E1] rounded-md" />
                      <div className="h-3 w-28 bg-[#E2E8F0] rounded" />
                    </div>
                    <div className="h-5 w-16 bg-[#CBD5E1] rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3 w-20 bg-[#E2E8F0] rounded" />
                      <div className="h-3 w-24 bg-[#CBD5E1] rounded" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-3 w-24 bg-[#E2E8F0] rounded" />
                      <div className="h-3 w-28 bg-[#CBD5E1] rounded" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-3 w-16 bg-[#E2E8F0] rounded" />
                      <div className="h-3 w-20 bg-[#CBD5E1] rounded" />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#F1F5F9] space-y-1.5">
                    <div className="h-3 w-32 bg-[#E2E8F0] rounded" />
                    <div className="flex gap-1.5">
                      <div className="h-5 w-16 bg-[#CBD5E1] rounded-md" />
                      <div className="h-5 w-16 bg-[#CBD5E1] rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : weeklyBlocks.length === 0 ? (
            // Actionable Empty State
            <div className="bg-white border border-[#CBD5E1] rounded-md p-10 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto text-[#64748B] mb-3">
                <CalendarX className="w-6 h-6 text-[#64748B]" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E293B]">
                No Block Windows In This Timeframe
              </h3>
              <p className="mt-1 text-xs text-[#64748B] max-w-md mx-auto">
                No possessions are scheduled for {currentWeekInfo.label.split(":")[0]} in corridor{" "}
                <span className="font-semibold text-[#071F4D]">{selectedCorridor}</span>.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setSelectedWeek(3)}
                  className="px-3 py-1.5 bg-[#0B3D91] hover:bg-[#1976D2] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  Jump to Week 3 (Active Intake)
                </button>
                {selectedCorridor !== "ALL" && (
                  <button
                    onClick={() => setSelectedCorridor("ALL")}
                    className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#071F4D] border border-[#CBD5E1] text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer shadow-xs"
                  >
                    Reset Corridor Filter
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeklyBlocks.map((block) => {
                const isScheduled = block.status === "Scheduled";
                return (
                  <div
                    key={block.id}
                    className={`bg-white border rounded-md shadow-sm overflow-hidden flex flex-col justify-between transition-all hover:shadow ${
                      isScheduled
                        ? "border-[#CBD5E1] border-t-4 border-t-[#16A34A]"
                        : "border-[#CBD5E1] border-t-4 border-t-[#1976D2]"
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-sm text-[#071F4D] block">
                            {block.id}
                          </span>
                          <span className="text-[11px] text-[#64748B] font-semibold">
                            {block.corridor} • {block.section}
                          </span>
                        </div>
                        {isScheduled ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]">
                            <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
                            <Clock className="w-3 h-3 text-[#1976D2]" />
                            Available
                          </span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[#64748B]">Scheduled Date:</span>
                          <span className="font-mono font-bold text-[#1E293B] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#1976D2]" />
                            {block.date}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[#64748B]">Possession Window:</span>
                          <span className="font-mono font-bold text-[#1E293B]">
                            {block.durationHours} Hours (01:00 - 05:00 Window)
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[#64748B]">Traffic Impact:</span>
                          <span className="font-medium text-[#334155]">
                            {block.trafficImpact}
                          </span>
                        </div>

                        {/* Participating Departments */}
                        <div className="pt-2 border-t border-[#F1F5F9]">
                          <span className="text-[11px] text-[#64748B] block mb-1.5 font-semibold uppercase">
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
                                  className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]"
                                >
                                  {dept}
                                </span>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Assigned Tasks Summary */}
                        {isScheduled && block.assignedTasks && block.assignedTasks.length > 0 && (
                          <div className="pt-2 border-t border-[#F1F5F9]">
                            <span className="text-[11px] text-[#64748B] block mb-1 font-semibold uppercase">
                              Bundled Tasks:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {block.assignedTasks.map((tId) => (
                                <span
                                  key={tId}
                                  className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]"
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
                    <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] text-[11px] text-[#64748B] italic">
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
        <div className="bg-white border border-[#CBD5E1] rounded-md shadow-sm overflow-hidden">
          <div className="bg-[#0B3D91] text-white px-4 py-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Monthly Corridor Maintenance Density Grid (September 2026)
            </h2>
            <span className="text-[11px] text-[#CBD5E1] font-mono">
              Total Managed Blocks: {filteredBlocks.length}
            </span>
          </div>

          <div className="p-4 sm:p-6 overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#CBD5E1]">
              <thead className="bg-[#F5F7FA] text-[#071F4D] uppercase font-bold text-[11px] border-b border-[#CBD5E1]">
                <tr>
                  <th className="py-2.5 px-3 border-r border-[#CBD5E1]">Corridor</th>
                  <th className="py-2.5 px-3 border-r border-[#CBD5E1]">Block ID</th>
                  <th className="py-2.5 px-3 border-r border-[#CBD5E1]">Date</th>
                  <th className="py-2.5 px-3 border-r border-[#CBD5E1]">Window</th>
                  <th className="py-2.5 px-3 border-r border-[#CBD5E1]">Departments Involved</th>
                  <th className="py-2.5 px-3 border-r border-[#CBD5E1]">Status</th>
                  <th className="py-2.5 px-3">Traffic Regulation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3 px-3 border-r border-[#E2E8F0]">
                        <div className="h-4 w-12 bg-[#E2E8F0] rounded-md mb-1" />
                        <div className="h-3 w-28 bg-[#F1F5F9] rounded" />
                      </td>
                      <td className="py-3 px-3 border-r border-[#E2E8F0]">
                        <div className="h-4 w-16 bg-[#E2E8F0] rounded-md" />
                      </td>
                      <td className="py-3 px-3 border-r border-[#E2E8F0]">
                        <div className="h-4 w-20 bg-[#E2E8F0] rounded-md" />
                      </td>
                      <td className="py-3 px-3 border-r border-[#E2E8F0] text-center">
                        <div className="h-4 w-8 bg-[#E2E8F0] rounded-md mx-auto" />
                      </td>
                      <td className="py-3 px-3 border-r border-[#E2E8F0]">
                        <div className="flex gap-1">
                          <div className="h-5 w-16 bg-[#E2E8F0] rounded-md" />
                          <div className="h-5 w-16 bg-[#E2E8F0] rounded-md" />
                        </div>
                      </td>
                      <td className="py-3 px-3 border-r border-[#E2E8F0]">
                        <div className="h-5 w-16 bg-[#E2E8F0] rounded-md" />
                      </td>
                      <td className="py-3 px-3">
                        <div className="h-4 w-32 bg-[#E2E8F0] rounded-md" />
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredBlocks.map((b) => (
                    <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-3 font-semibold text-[#1E293B] border-r border-[#E2E8F0]">
                        <div>{b.corridor}</div>
                        <div className="text-[10px] text-[#64748B]">{b.corridorName}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#071F4D] border-r border-[#E2E8F0]">
                        {b.id}
                      </td>
                      <td className="py-3 px-3 font-mono border-r border-[#E2E8F0] text-[#1E293B]">
                        {b.date}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-center border-r border-[#E2E8F0] text-[#1E293B]">
                        {b.durationHours}h
                      </td>
                      <td className="py-3 px-3 border-r border-[#E2E8F0]">
                        <div className="flex flex-wrap gap-1">
                          {(b.departments?.length > 0 ? b.departments : b.allowedDepartments || []).map((d) => (
                            <DepartmentBadge key={d} department={d} />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 border-r border-[#E2E8F0]">
                        {b.status === "Scheduled" ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[11px] text-[#64748B]">
                        {b.trafficImpact}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

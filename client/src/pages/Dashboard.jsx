import React, { useState, useEffect } from "react";
import { fetchDashboardSummary, fetchMaintenanceTasks } from "../services/api";
import DepartmentBadge from "../components/DepartmentBadge";
import PriorityBadge from "../components/PriorityBadge";
import HeroBanner from "../components/HeroBanner";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Calendar,
  Filter,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  RefreshCw
} from "lucide-react";

export default function Dashboard({ onNavigateToOptimizer }) {
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [corridorFilter, setCorridorFilter] = useState("ALL");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sumData, taskData] = await Promise.all([
        fetchDashboardSummary(),
        fetchMaintenanceTasks()
      ]);
      setSummary(sumData.summary);
      setTasks(taskData.tasks);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter tasks based on controls
  const filteredTasks = tasks.filter((t) => {
    if (departmentFilter !== "ALL" && t.department !== departmentFilter) return false;
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    if (corridorFilter !== "ALL" && t.corridor !== corridorFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* High-Impact Operations Banner */}
      <HeroBanner onQuickOptimize={() => onNavigateToOptimizer(["T001", "T002", "T003"])} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Error notification if backend unreachable */}
        {error && (
          <div className="bg-[#FEF2F2] border-l-4 border-[#ED1B24] p-4 text-xs text-[#991B1B] flex items-center justify-between">
            <span>Error connecting to RailOptima Backend: {error}</span>
            <button
              onClick={loadData}
              className="px-2.5 py-1 bg-[#ED1B24] text-white rounded font-bold uppercase text-[10px]"
            >
              Retry
            </button>
          </div>
        )}

        {/* Operational Metric Cards (Every stat mapped to real backend field) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 border border-[#CCCCCC] rounded shadow-sm border-l-4 border-l-[#312F30]">
            <div className="flex items-center justify-between text-[#999999] text-xs font-bold uppercase tracking-wider">
              <span>Total Requests</span>
              <ClipboardList className="w-4 h-4 text-[#312F30]" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-[#312F30]">
              {loading ? "--" : summary?.totalRequests ?? 0}
            </div>
            <span className="text-[11px] text-[#999999] mt-1 block">
              Across TMS, SMMS & TDMS
            </span>
          </div>

          <div className="bg-white p-4 border border-[#CCCCCC] rounded shadow-sm border-l-4 border-l-[#ED1B24]">
            <div className="flex items-center justify-between text-[#999999] text-xs font-bold uppercase tracking-wider">
              <span>Pending Intake</span>
              <Clock className="w-4 h-4 text-[#ED1B24]" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-[#ED1B24]">
              {loading ? "--" : summary?.pendingRequests ?? 0}
            </div>
            <span className="text-[11px] text-[#999999] mt-1 block">
              Awaiting coordinated grouping
            </span>
          </div>

          <div className="bg-white p-4 border border-[#CCCCCC] rounded shadow-sm border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between text-[#999999] text-xs font-bold uppercase tracking-wider">
              <span>Scheduled Tasks</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-emerald-700">
              {loading ? "--" : summary?.scheduledRequests ?? 0}
            </div>
            <span className="text-[11px] text-[#999999] mt-1 block">
              Dispatched into approved blocks
            </span>
          </div>

          <div className="bg-white p-4 border border-[#CCCCCC] rounded shadow-sm border-l-4 border-l-[#0284C7]">
            <div className="flex items-center justify-between text-[#999999] text-xs font-bold uppercase tracking-wider">
              <span>Planned Blocks</span>
              <Calendar className="w-4 h-4 text-[#0284C7]" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-[#0284C7]">
              {loading ? "--" : summary?.plannedBlocks ?? 0}
            </div>
            <span className="text-[11px] text-[#999999] mt-1 block">
              Approved COA windows ({summary?.availableBlocks ?? 0} available)
            </span>
          </div>
        </div>

        {/* Department-Wise Distribution Breakdown (TMS / SMMS / TDMS) */}
        <div className="bg-white border border-[#CCCCCC] rounded shadow-sm overflow-hidden">
          <div className="bg-[#312F30] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#ED1B24]" />
              <h2 className="text-xs font-bold uppercase tracking-wider">
                Department-Wise Maintenance Intake Distribution
              </h2>
            </div>
            <span className="text-[11px] text-[#CCCCCC] font-mono">
              Synchronized Multi-Department View
            </span>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TMS Panel */}
            <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded space-y-3">
              <div className="flex items-center justify-between">
                <DepartmentBadge department="TMS" showFullName />
                <span className="font-mono text-lg font-black text-[#312F30]">
                  {summary?.departmentBreakdown?.TMS?.count ?? 0}
                </span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-2 rounded overflow-hidden">
                <div
                  className="bg-[#1E293B] h-2 rounded transition-all duration-500"
                  style={{
                    width: `${summary?.departmentBreakdown?.TMS?.percentOfTotal ?? 0}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#666666]">
                <span>Pending: <strong className="text-[#312F30]">{summary?.departmentBreakdown?.TMS?.pending ?? 0}</strong></span>
                <span>Scheduled: <strong className="text-emerald-700">{summary?.departmentBreakdown?.TMS?.scheduled ?? 0}</strong></span>
                <span>Share: {summary?.departmentBreakdown?.TMS?.percentOfTotal ?? 0}%</span>
              </div>
            </div>

            {/* SMMS Panel */}
            <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded space-y-3">
              <div className="flex items-center justify-between">
                <DepartmentBadge department="SMMS" showFullName />
                <span className="font-mono text-lg font-black text-[#312F30]">
                  {summary?.departmentBreakdown?.SMMS?.count ?? 0}
                </span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-2 rounded overflow-hidden">
                <div
                  className="bg-[#0284C7] h-2 rounded transition-all duration-500"
                  style={{
                    width: `${summary?.departmentBreakdown?.SMMS?.percentOfTotal ?? 0}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#666666]">
                <span>Pending: <strong className="text-[#312F30]">{summary?.departmentBreakdown?.SMMS?.pending ?? 0}</strong></span>
                <span>Scheduled: <strong className="text-emerald-700">{summary?.departmentBreakdown?.SMMS?.scheduled ?? 0}</strong></span>
                <span>Share: {summary?.departmentBreakdown?.SMMS?.percentOfTotal ?? 0}%</span>
              </div>
            </div>

            {/* TDMS Panel */}
            <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded space-y-3">
              <div className="flex items-center justify-between">
                <DepartmentBadge department="TDMS" showFullName />
                <span className="font-mono text-lg font-black text-[#312F30]">
                  {summary?.departmentBreakdown?.TDMS?.count ?? 0}
                </span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-2 rounded overflow-hidden">
                <div
                  className="bg-[#D97706] h-2 rounded transition-all duration-500"
                  style={{
                    width: `${summary?.departmentBreakdown?.TDMS?.percentOfTotal ?? 0}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#666666]">
                <span>Pending: <strong className="text-[#312F30]">{summary?.departmentBreakdown?.TDMS?.pending ?? 0}</strong></span>
                <span>Scheduled: <strong className="text-emerald-700">{summary?.departmentBreakdown?.TDMS?.scheduled ?? 0}</strong></span>
                <span>Share: {summary?.departmentBreakdown?.TDMS?.percentOfTotal ?? 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Maintenance Requests Queue (Dense Operational Table) */}
        <div className="bg-white border border-[#CCCCCC] rounded shadow-sm overflow-hidden">
          {/* Table Controls Header */}
          <div className="bg-[#1C1A1B] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#312F30]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#ED1B24]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Live Fixed Infrastructure Maintenance Queue ({filteredTasks.length})
              </h2>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-[#312F30] text-white text-xs border border-[#444] rounded px-2.5 py-1"
              >
                <option value="ALL">All Departments</option>
                <option value="TMS">TMS (Track)</option>
                <option value="SMMS">SMMS (Signals)</option>
                <option value="TDMS">TDMS (Traction)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#312F30] text-white text-xs border border-[#444] rounded px-2.5 py-1"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
              </select>

              <select
                value={corridorFilter}
                onChange={(e) => setCorridorFilter(e.target.value)}
                className="bg-[#312F30] text-white text-xs border border-[#444] rounded px-2.5 py-1"
              >
                <option value="ALL">All Corridors</option>
                <option value="C01">C01: Simulated Section Alpha–Beta</option>
                <option value="C02">C02: Simulated Section Gamma–Delta</option>
                <option value="C03">C03: Simulated Section Epsilon–Zeta</option>
              </select>

              <button
                onClick={loadData}
                className="p-1.5 bg-[#312F30] hover:bg-[#444] text-[#CCCCCC] rounded border border-[#555]"
                title="Refresh Table Data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table view */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F2F2] text-[#312F30] uppercase font-bold text-[11px] border-b border-[#CCCCCC]">
                <tr>
                  <th className="py-2.5 px-3">Task ID</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Activity & Work Scope</th>
                  <th className="py-2.5 px-3">Corridor & Section</th>
                  <th className="py-2.5 px-3 text-center">Duration</th>
                  <th className="py-2.5 px-3 text-center">Priority</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-[#999999] text-xs">
                      No maintenance tasks match the active filters.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-[#F9F9F9] transition-colors group"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-[#312F30]">
                        {t.id}
                      </td>
                      <td className="py-2.5 px-3">
                        <DepartmentBadge department={t.department} />
                      </td>
                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="font-bold text-[#312F30]">{t.title}</div>
                        <div className="text-[11px] text-[#666666] truncate" title={t.workType}>
                          {t.workType}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[#312F30]">{t.corridor}</div>
                        <div className="text-[11px] text-[#777777]">{t.section}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        {t.durationHours}h
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {t.status === "Scheduled" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Scheduled ({t.assignedBlockId || "COA"})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#F2F2F2] text-[#666666] border border-[#CCCCCC]">
                            <Clock className="w-3 h-3 text-[#999999]" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {t.status === "Pending" ? (
                          <button
                            onClick={() => onNavigateToOptimizer([t.id])}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase rounded bg-[#312F30] text-white hover:bg-[#ED1B24] transition-colors"
                          >
                            Optimize
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#999999] font-mono">
                            Locked in Plan
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  RefreshCw,
  Download,
  Sparkles,
  CalendarDays,
  FilterX
} from "lucide-react";

export default function Dashboard({ onNavigateToOptimizer, onNavigateToTab }) {
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [corridorFilter, setCorridorFilter] = useState("ALL");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [sumData, taskData] = await Promise.all([
        fetchDashboardSummary(),
        fetchMaintenanceTasks()
      ]);
      setSummary(sumData.summary);
      setTasks(taskData.tasks || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter tasks with useMemo for performance
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (departmentFilter !== "ALL" && t.department !== departmentFilter) return false;
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
      if (corridorFilter !== "ALL" && t.corridor !== corridorFilter) return false;
      return true;
    });
  }, [tasks, departmentFilter, statusFilter, corridorFilter]);

  const handleClearFilters = useCallback(() => {
    setDepartmentFilter("ALL");
    setStatusFilter("ALL");
    setCorridorFilter("ALL");
  }, []);

  // Functional CSV Export for Railway Maintenance Operations
  const handleExportReport = useCallback(() => {
    if (tasks.length === 0) return;

    const headers = [
      "Task ID",
      "Department",
      "Title",
      "Work Scope",
      "Corridor",
      "Section",
      "Duration (Hours)",
      "Priority",
      "Status",
      "Assigned Block"
    ];

    const dataToExport = filteredTasks.length > 0 ? filteredTasks : tasks;
    const rows = dataToExport.map((t) => [
      t.id,
      t.department,
      `"${(t.title || "").replace(/"/g, '""')}"`,
      `"${(t.workType || "").replace(/"/g, '""')}"`,
      t.corridor,
      `"${(t.section || "").replace(/"/g, '""')}"`,
      t.durationHours,
      t.priority,
      t.status,
      t.assignedBlockId || "Unassigned"
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `railoptima-maintenance-report-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredTasks, tasks]);

  return (
    <div className="space-y-6 pb-12">
      {/* High-Impact Operations Banner */}
      <HeroBanner onQuickOptimize={() => onNavigateToOptimizer(["T001", "T002", "T003"])} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Error notification if backend unreachable (Strictly Red #DC2626) */}
        {error && (
          <div className="bg-[#FEF2F2] border-l-4 border-[#DC2626] p-4 text-xs text-[#991B1B] flex items-center justify-between">
            <span>Error connecting to RailOptima Backend: {error}</span>
            <button
              onClick={loadData}
              className="px-2.5 py-1 bg-[#DC2626] text-white rounded font-bold uppercase text-[10px]"
            >
              Retry
            </button>
          </div>
        )}

        {/* Operational Metric Cards (Every stat mapped to real backend field) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 border border-[#CBD5E1] rounded-md shadow-sm border-l-4 border-l-[#0B3D91] transition-shadow hover:shadow">
            <div className="flex items-center justify-between text-[#64748B] text-xs font-bold uppercase tracking-wider">
              <span>Total Requests</span>
              <ClipboardList className="w-4 h-4 text-[#0B3D91]" />
            </div>
            {loading ? (
              <div className="h-8 w-20 bg-[#E2E8F0] rounded-md animate-pulse mt-2" />
            ) : (
              <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-[#0B3D91]">
                {summary?.totalRequests ?? 0}
              </div>
            )}
            <span className="text-[11px] text-[#64748B] mt-1 block">
              Across TMS, SMMS & TDMS
            </span>
          </div>

          <div className="bg-white p-4 border border-[#CBD5E1] rounded-md shadow-sm border-l-4 border-l-[#F59E0B] transition-shadow hover:shadow">
            <div className="flex items-center justify-between text-[#64748B] text-xs font-bold uppercase tracking-wider">
              <span>Pending Intake</span>
              <Clock className="w-4 h-4 text-[#F59E0B]" />
            </div>
            {loading ? (
              <div className="h-8 w-20 bg-[#E2E8F0] rounded-md animate-pulse mt-2" />
            ) : (
              <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-[#D97706]">
                {summary?.pendingRequests ?? 0}
              </div>
            )}
            <span className="text-[11px] text-[#64748B] mt-1 block">
              Awaiting coordinated grouping
            </span>
          </div>

          <div className="bg-white p-4 border border-[#CBD5E1] rounded-md shadow-sm border-l-4 border-l-[#16A34A] transition-shadow hover:shadow">
            <div className="flex items-center justify-between text-[#64748B] text-xs font-bold uppercase tracking-wider">
              <span>Scheduled Tasks</span>
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            </div>
            {loading ? (
              <div className="h-8 w-20 bg-[#E2E8F0] rounded-md animate-pulse mt-2" />
            ) : (
              <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-[#16A34A]">
                {summary?.scheduledRequests ?? 0}
              </div>
            )}
            <span className="text-[11px] text-[#64748B] mt-1 block">
              Dispatched into approved blocks
            </span>
          </div>

          <div className="bg-white p-4 border border-[#CBD5E1] rounded-md shadow-sm border-l-4 border-l-[#1976D2] transition-shadow hover:shadow">
            <div className="flex items-center justify-between text-[#64748B] text-xs font-bold uppercase tracking-wider">
              <span>Planned Blocks</span>
              <Calendar className="w-4 h-4 text-[#1976D2]" />
            </div>
            {loading ? (
              <div className="h-8 w-20 bg-[#E2E8F0] rounded-md animate-pulse mt-2" />
            ) : (
              <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-[#1976D2]">
                {summary?.plannedBlocks ?? 0}
              </div>
            )}
            <span className="text-[11px] text-[#64748B] mt-1 block">
              Approved COA windows ({summary?.availableBlocks ?? 0} available)
            </span>
          </div>
        </div>

        {/* Operational Quick Actions Bar */}
        <div className="bg-white border border-[#CBD5E1] rounded-md p-3.5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1976D2]"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#071F4D]">
              Operational Quick Actions
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Action 1: Generate Optimized Plan */}
            <button
              onClick={() => {
                const pending = tasks.filter((t) => t.status === "Pending").map((t) => t.id);
                onNavigateToOptimizer(
                  pending.length > 0 ? pending.slice(0, 3) : ["T001", "T002", "T003"]
                );
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-[#1976D2] hover:bg-[#1565C0] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Optimized Plan</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/20 text-white font-mono">
                AI
              </span>
            </button>

            {/* Action 2: View All Block Plans */}
            <button
              onClick={() => {
                if (onNavigateToTab) onNavigateToTab("plans");
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-[#0B3D91] hover:bg-[#071F4D] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>View All Block Plans</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/20 text-white font-mono">
                {summary?.plannedBlocks ?? 0}
              </span>
            </button>

            {/* Action 3: Export Report (CSV) */}
            <button
              onClick={handleExportReport}
              disabled={loading || tasks.length === 0}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-[#F8FAFC] text-[#071F4D] border border-[#CBD5E1] hover:border-[#94A3B8] disabled:opacity-50 text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors cursor-pointer"
              title="Download CSV operational summary of maintenance tasks"
            >
              <Download className="w-3.5 h-3.5 text-[#1976D2]" />
              <span>Export Report</span>
              <span className="text-[10px] text-[#64748B] font-mono">CSV</span>
            </button>
          </div>
        </div>

        {/* Department-Wise Distribution Breakdown (TMS / SMMS / TDMS) */}
        <div className="bg-white border border-[#CBD5E1] rounded-md shadow-sm overflow-hidden">
          <div className="bg-[#0B3D91] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-300" />
              <h2 className="text-xs font-bold uppercase tracking-wider">
                Department-Wise Maintenance Intake Distribution
              </h2>
            </div>
            <span className="text-[11px] text-[#CBD5E1] font-mono">
              Synchronized Multi-Department View
            </span>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-3 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-24 bg-[#CBD5E1] rounded-md" />
                    <div className="h-5 w-8 bg-[#CBD5E1] rounded-md" />
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-md overflow-hidden">
                    <div className="bg-[#CBD5E1] h-2 w-1/2 rounded-md" />
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <div className="h-3 w-16 bg-[#E2E8F0] rounded" />
                    <div className="h-3 w-16 bg-[#E2E8F0] rounded" />
                    <div className="h-3 w-12 bg-[#E2E8F0] rounded" />
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* TMS Panel */}
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <DepartmentBadge department="TMS" showFullName />
                    <span className="font-mono text-lg font-black text-[#0B3D91]">
                      {summary?.departmentBreakdown?.TMS?.count ?? 0}
                    </span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-md overflow-hidden">
                    <div
                      className="bg-[#071F4D] h-2 rounded-md transition-all duration-500"
                      style={{
                        width: `${summary?.departmentBreakdown?.TMS?.percentOfTotal ?? 0}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#64748B]">
                    <span>Pending: <strong className="text-[#D97706]">{summary?.departmentBreakdown?.TMS?.pending ?? 0}</strong></span>
                    <span>Scheduled: <strong className="text-[#16A34A]">{summary?.departmentBreakdown?.TMS?.scheduled ?? 0}</strong></span>
                    <span>Share: {summary?.departmentBreakdown?.TMS?.percentOfTotal ?? 0}%</span>
                  </div>
                </div>

                {/* SMMS Panel */}
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <DepartmentBadge department="SMMS" showFullName />
                    <span className="font-mono text-lg font-black text-[#1976D2]">
                      {summary?.departmentBreakdown?.SMMS?.count ?? 0}
                    </span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-md overflow-hidden">
                    <div
                      className="bg-[#1976D2] h-2 rounded-md transition-all duration-500"
                      style={{
                        width: `${summary?.departmentBreakdown?.SMMS?.percentOfTotal ?? 0}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#64748B]">
                    <span>Pending: <strong className="text-[#D97706]">{summary?.departmentBreakdown?.SMMS?.pending ?? 0}</strong></span>
                    <span>Scheduled: <strong className="text-[#16A34A]">{summary?.departmentBreakdown?.SMMS?.scheduled ?? 0}</strong></span>
                    <span>Share: {summary?.departmentBreakdown?.SMMS?.percentOfTotal ?? 0}%</span>
                  </div>
                </div>

                {/* TDMS Panel */}
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <DepartmentBadge department="TDMS" showFullName />
                    <span className="font-mono text-lg font-black text-[#D97706]">
                      {summary?.departmentBreakdown?.TDMS?.count ?? 0}
                    </span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-md overflow-hidden">
                    <div
                      className="bg-[#F59E0B] h-2 rounded-md transition-all duration-500"
                      style={{
                        width: `${summary?.departmentBreakdown?.TDMS?.percentOfTotal ?? 0}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#64748B]">
                    <span>Pending: <strong className="text-[#D97706]">{summary?.departmentBreakdown?.TDMS?.pending ?? 0}</strong></span>
                    <span>Scheduled: <strong className="text-[#16A34A]">{summary?.departmentBreakdown?.TDMS?.scheduled ?? 0}</strong></span>
                    <span>Share: {summary?.departmentBreakdown?.TDMS?.percentOfTotal ?? 0}%</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Live Maintenance Requests Queue (Dense Operational Table) */}
        <div className="bg-white border border-[#CBD5E1] rounded-md shadow-sm overflow-hidden">
          {/* Table Controls Header */}
          <div className="bg-[#071F4D] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#0B3D91]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#1976D2]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Live Fixed Infrastructure Maintenance Queue ({filteredTasks.length})
              </h2>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-[#0B3D91] text-white text-xs border border-[#1976D2]/40 rounded-md px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-[#1976D2]"
              >
                <option value="ALL">All Departments</option>
                <option value="TMS">TMS (Track)</option>
                <option value="SMMS">SMMS (Signals)</option>
                <option value="TDMS">TDMS (Traction)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#0B3D91] text-white text-xs border border-[#1976D2]/40 rounded-md px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-[#1976D2]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
              </select>

              <select
                value={corridorFilter}
                onChange={(e) => setCorridorFilter(e.target.value)}
                className="bg-[#0B3D91] text-white text-xs border border-[#1976D2]/40 rounded-md px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-[#1976D2]"
              >
                <option value="ALL">All Corridors</option>
                <option value="C01">C01: Simulated Section Alpha–Beta</option>
                <option value="C02">C02: Simulated Section Gamma–Delta</option>
                <option value="C03">C03: Simulated Section Epsilon–Zeta</option>
              </select>

              <button
                onClick={loadData}
                className="p-1.5 bg-[#0B3D91] hover:bg-[#1976D2] text-white rounded-md border border-[#1976D2]/40 transition-colors cursor-pointer"
                title="Refresh Table Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Table view */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-[#071F4D] uppercase font-bold text-[11px] border-b border-[#CBD5E1]">
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
              <tbody className="divide-y divide-[#E2E8F0]">
                {loading ? (
                  // 4 Skeleton Rows during initial data fetch
                  [1, 2, 3, 4].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3 px-3">
                        <div className="h-4 w-12 bg-[#E2E8F0] rounded-md" />
                      </td>
                      <td className="py-3 px-3">
                        <div className="h-5 w-20 bg-[#E2E8F0] rounded-md" />
                      </td>
                      <td className="py-3 px-3">
                        <div className="h-4 w-44 bg-[#E2E8F0] rounded-md mb-1" />
                        <div className="h-3 w-28 bg-[#F1F5F9] rounded" />
                      </td>
                      <td className="py-3 px-3">
                        <div className="h-4 w-16 bg-[#E2E8F0] rounded-md mb-1" />
                        <div className="h-3 w-24 bg-[#F1F5F9] rounded" />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="h-4 w-8 bg-[#E2E8F0] rounded-md mx-auto" />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="h-5 w-16 bg-[#E2E8F0] rounded-md mx-auto" />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="h-5 w-20 bg-[#E2E8F0] rounded-md mx-auto" />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="h-6 w-16 bg-[#E2E8F0] rounded-md ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : filteredTasks.length === 0 ? (
                  // Actionable Empty State
                  <tr>
                    <td colSpan="8" className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                        <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
                          <FilterX className="w-5 h-5 text-[#64748B]" />
                        </div>
                        <div className="font-bold text-sm text-[#1E293B]">
                          No maintenance tasks match the active filters
                        </div>
                        <p className="text-xs text-[#64748B]">
                          There are currently no tasks matching your selected department, status, or corridor criteria.
                        </p>
                        <button
                          onClick={handleClearFilters}
                          className="mt-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md bg-[#0B3D91] hover:bg-[#1976D2] text-white transition-colors cursor-pointer shadow-xs"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-[#071F4D]">
                        {t.id}
                      </td>
                      <td className="py-2.5 px-3">
                        <DepartmentBadge department={t.department} />
                      </td>
                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="font-bold text-[#1E293B]">{t.title}</div>
                        <div className="text-[11px] text-[#64748B] truncate" title={t.workType}>
                          {t.workType}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[#1E293B]">{t.corridor}</div>
                        <div className="text-[11px] text-[#64748B]">{t.section}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-[#1E293B]">
                        {t.durationHours}h
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {t.status === "Scheduled" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]">
                            <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                            Scheduled ({t.assignedBlockId || "COA"})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                            <Clock className="w-3 h-3 text-[#D97706]" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {t.status === "Pending" ? (
                          <button
                            onClick={() => onNavigateToOptimizer([t.id])}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase rounded-md bg-[#1976D2] text-white hover:bg-[#1565C0] transition-colors shadow-xs cursor-pointer"
                          >
                            Optimize
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#94A3B8] font-mono">
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

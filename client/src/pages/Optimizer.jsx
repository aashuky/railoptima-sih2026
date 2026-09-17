import React, { useState, useEffect } from "react";
import { fetchMaintenanceTasks, optimizeSchedule, approvePlan } from "../services/api";
import DepartmentBadge from "../components/DepartmentBadge";
import PriorityBadge from "../components/PriorityBadge";
import ExplainabilityCard from "../components/ExplainabilityCard";
import SimulatedComparison from "../components/SimulatedComparison";
import {
  GitMerge,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Layers,
  Check,
  Calendar,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export default function Optimizer({ initialTaskIds = [], onPlanApproved }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [approving, setApproving] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [approvalSuccess, setApprovalSuccess] = useState(null);

  // Load pending tasks
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMaintenanceTasks({ status: "Pending" });
      const pendingList = res.tasks || [];
      setTasks(pendingList);

      // Default selection: if initialTaskIds given use them, otherwise default to T001, T002, T003 if pending
      if (initialTaskIds && initialTaskIds.length > 0) {
        const valid = initialTaskIds.filter((id) => pendingList.some((t) => t.id === id));
        setSelectedTaskIds(valid);
      } else {
        const seedGroup = ["T001", "T002", "T003"].filter((id) =>
          pendingList.some((t) => t.id === id)
        );
        setSelectedTaskIds(seedGroup.length > 0 ? seedGroup : pendingList.slice(0, 3).map((t) => t.id));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load pending tasks: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggleTask = (id) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectSeedDemo = () => {
    const seed = ["T001", "T002", "T003"].filter((id) => tasks.some((t) => t.id === id));
    setSelectedTaskIds(seed);
  };

  const handleSelectAll = () => {
    setSelectedTaskIds(tasks.map((t) => t.id));
  };

  const handleGeneratePlan = async () => {
    if (selectedTaskIds.length === 0) {
      setError("Please select at least one pending task to generate an optimized block plan.");
      return;
    }

    try {
      setOptimizing(true);
      setError(null);
      setApprovalSuccess(null);
      const res = await optimizeSchedule(selectedTaskIds);
      setPlan(res);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate optimized block schedule.");
      setPlan(null);
    } finally {
      setOptimizing(false);
    }
  };

  const handleApprovePlan = async () => {
    if (!plan || !plan.planId) return;

    try {
      setApproving(true);
      setError(null);
      const res = await approvePlan(plan.planId);
      setApprovalSuccess(res.message);
      // Reload pending tasks
      await loadTasks();
      if (onPlanApproved) onPlanApproved(res);
    } catch (err) {
      console.error(err);
      setError("Approval error: " + err.message);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = () => {
    setPlan(null);
    setApprovalSuccess(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="bg-[#111111] text-white p-6 rounded border border-[#312F30] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ED1B24]">
            <Sparkles className="w-4 h-4" />
            Rule-Based Coordinated Scheduling Engine
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
            AI Block Optimizer
          </h1>
          <p className="text-xs text-[#CCCCCC] mt-1 max-w-2xl">
            Select pending maintenance requests to evaluate physical corridor compatibility,
            safety clearances, and greedily bundle tasks into minimal COA block windows.
          </p>
        </div>

        {/* Quick selection shortcuts */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSelectSeedDemo}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded bg-[#312F30] hover:bg-[#444] text-[#CCCCCC] hover:text-white border border-[#555] transition-all"
          >
            Select Seed Demo (T001, T002, T003)
          </button>
          <button
            onClick={handleSelectAll}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded bg-[#1C1A1B] hover:bg-[#2A2829] text-[#999999] hover:text-white border border-[#444] transition-all"
          >
            Select All ({tasks.length})
          </button>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {error && (
        <div className="p-4 bg-[#FEF2F2] border-l-4 border-[#ED1B24] rounded-r text-xs text-[#991B1B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#ED1B24] shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-[#991B1B] font-bold text-sm px-2"
          >
            ×
          </button>
        </div>
      )}

      {approvalSuccess && (
        <div className="p-4 bg-[#F0FDF4] border-l-4 border-emerald-600 rounded-r text-xs text-[#166534] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold uppercase text-[11px] block text-emerald-800">
                Plan Confirmed & Dispatched
              </span>
              <span>{approvalSuccess}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Task Intake Queue vs Optimization Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pending Task Selection Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#CCCCCC] rounded shadow-sm overflow-hidden">
            <div className="bg-[#312F30] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ED1B24]" />
                <h2 className="text-xs font-bold uppercase tracking-wider">
                  Pending Intake Queue ({selectedTaskIds.length}/{tasks.length} Selected)
                </h2>
              </div>
              <span className="text-[10px] text-[#CCCCCC] font-mono">
                Click to toggle
              </span>
            </div>

            <div className="divide-y divide-[#E5E5E5] max-h-[550px] overflow-y-auto p-2 space-y-1">
              {loading ? (
                <div className="p-8 text-center text-xs text-[#999999]">
                  Loading pending tasks...
                </div>
              ) : tasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#999999]">
                  No pending maintenance tasks found in queue. Click "Reset Demo Data" in the top bar to re-seed demo requests.
                </div>
              ) : (
                tasks.map((task) => {
                  const isChecked = selectedTaskIds.includes(task.id);
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`p-3 rounded border transition-all cursor-pointer select-none ${
                        isChecked
                          ? "bg-[#FFF5F5] border-[#ED1B24]/40 shadow-xs"
                          : "bg-white border-transparent hover:bg-[#F9F9F9]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 accent-[#ED1B24] rounded cursor-pointer"
                          />
                          <span className="font-mono font-bold text-xs text-[#312F30]">
                            {task.id}
                          </span>
                          <DepartmentBadge department={task.department} />
                        </div>
                        <PriorityBadge priority={task.priority} />
                      </div>

                      <div className="mt-2 pl-6">
                        <div className="text-xs font-bold text-[#312F30]">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-[#666666] line-clamp-1">
                          {task.workType}
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[11px] text-[#888888] pt-1 border-t border-[#F0F0F0]">
                          <span className="font-semibold text-[#312F30]">
                            {task.corridor} • {task.section.split("(")[0]}
                          </span>
                          <span className="font-mono font-bold text-[#312F30] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#ED1B24]" />
                            {task.durationHours}h
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Action Trigger Button */}
            <div className="p-3 bg-[#F9F9F9] border-t border-[#CCCCCC]">
              <button
                onClick={handleGeneratePlan}
                disabled={optimizing || selectedTaskIds.length === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#ED1B24] hover:bg-[#B52229] disabled:bg-[#999999] text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-sm"
              >
                <GitMerge className={`w-4 h-4 ${optimizing ? "animate-spin" : ""}`} />
                {optimizing
                  ? "Evaluating Feasibility..."
                  : `Generate Optimized Plan (${selectedTaskIds.length} Tasks)`}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Optimization Results, Simulated Comparison & Approval */}
        <div className="lg:col-span-7 space-y-6">
          {!plan ? (
            <div className="bg-white border border-[#CCCCCC] rounded p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-[#F2F2F2] rounded-full flex items-center justify-center mx-auto text-[#999999]">
                <GitMerge className="w-6 h-6 text-[#ED1B24]" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#312F30]">
                  No Optimization Plan Generated Yet
                </h3>
                <p className="mt-1 text-xs text-[#777777] max-w-md mx-auto">
                  Select maintenance requests on the left (e.g. Seed tasks T001, T002, T003)
                  and click "Generate Optimized Plan" to run rule-based compatibility scoring
                  and greedy block packing.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Recommended Coordinated Block Card */}
              <div className="bg-white border-2 border-[#ED1B24] rounded shadow-sm overflow-hidden">
                <div className="bg-[#111111] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#312F30]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ED1B24] animate-ping"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Recommended Coordinated Block
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#312F30] text-[#ED1B24] border border-[#555] font-bold">
                      {plan.blockId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#999999] uppercase">Score:</span>
                    <span className="font-mono font-bold text-white bg-[#ED1B24] px-2 py-0.5 rounded">
                      {plan.compatibilityScore} / 100
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Block Window Metadata */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F9F9F9] p-3 rounded border border-[#E5E5E5]">
                    <div>
                      <span className="text-[#999999] uppercase text-[10px] block font-semibold">Corridor</span>
                      <span className="font-bold text-[#312F30]">{plan.corridor}</span>
                      <span className="text-[10px] text-[#666666] block truncate">{plan.corridorName}</span>
                    </div>
                    <div>
                      <span className="text-[#999999] uppercase text-[10px] block font-semibold">Section</span>
                      <span className="font-bold text-[#312F30] truncate block">{plan.section}</span>
                    </div>
                    <div>
                      <span className="text-[#999999] uppercase text-[10px] block font-semibold">Window Hours</span>
                      <span className="font-mono font-bold text-[#312F30]">
                        {plan.totalDuration}h / {plan.maxWindowHours}h Cap
                      </span>
                    </div>
                    <div>
                      <span className="text-[#999999] uppercase text-[10px] block font-semibold">Scheduled Date</span>
                      <span className="font-mono font-bold text-[#312F30]">{plan.date}</span>
                    </div>
                  </div>

                  {/* Combined Tasks List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#312F30] mb-2">
                      Tasks Combined in this Coordinated Possession ({plan.assignedTasks.length})
                    </h4>
                    <div className="space-y-2">
                      {plan.assignedTasks.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-2.5 bg-[#FAFAFA] border border-[#CCCCCC] rounded text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-[#312F30]">{t.id}</span>
                            <DepartmentBadge department={t.department} />
                            <div>
                              <span className="font-bold text-[#312F30]">{t.title}</span>
                              <span className="text-[11px] text-[#777777] ml-2 hidden sm:inline">
                                {t.workType}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <PriorityBadge priority={t.priority} />
                            <span className="font-mono font-bold text-[#312F30] bg-[#EEEEEE] px-2 py-0.5 rounded">
                              {t.durationHours}h
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explainable AI Component */}
                  <ExplainabilityCard plan={plan} />

                  {/* Simulated Scenario Comparison */}
                  <SimulatedComparison comparison={plan.simulatedComparison} />

                  {/* Human-in-the-Loop Approval Action Bar */}
                  <div className="bg-[#F2F2F2] p-4 rounded border border-[#CCCCCC] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase text-[#312F30]">
                        Human-in-the-Loop Planner Verification
                      </div>
                      <p className="text-[11px] text-[#666666]">
                        Review the compatibility breakdown and simulated operational impact before dispatching to COA.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleReject}
                        className="flex-1 sm:flex-none px-3 py-2 text-xs font-bold uppercase tracking-wider rounded bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#312F30] border border-[#CCCCCC] transition-colors"
                      >
                        Reset
                      </button>

                      <button
                        onClick={handleApprovePlan}
                        disabled={approving}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider rounded bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white shadow-sm transition-all"
                      >
                        <Check className={`w-4 h-4 ${approving ? "animate-spin" : ""}`} />
                        {approving ? "Approving..." : "Approve & Schedule Plan"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

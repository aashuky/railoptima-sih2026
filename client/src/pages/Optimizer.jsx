import React, { useState, useEffect, useCallback } from "react";
import { fetchMaintenanceTasks, optimizeSchedule, approvePlan, explainPlan } from "../services/api";
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
  ArrowRight,
  Inbox,
  RefreshCw
} from "lucide-react";

export default function Optimizer({ initialTaskIds = [], user, onPlanApproved }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [approving, setApproving] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [approvalSuccess, setApprovalSuccess] = useState(null);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const canApprove = user?.role === "controller" || user?.role === "admin";

  // Load pending tasks
  const loadTasks = useCallback(async () => {
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
  }, [initialTaskIds]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleToggleTask = useCallback((id) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleSelectSeedDemo = useCallback(() => {
    const seed = ["T001", "T002", "T003"].filter((id) => tasks.some((t) => t.id === id));
    setSelectedTaskIds(seed);
  }, [tasks]);

  const handleSelectAll = useCallback(() => {
    setSelectedTaskIds(tasks.map((t) => t.id));
  }, [tasks]);

  const handleGeneratePlan = useCallback(async () => {
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
      setAiExplanation(null);
      setAiError(null);
      setAiLoading(true);
      explainPlan(res)
        .then((aiRes) => setAiExplanation(aiRes.explanation))
        .catch((err) =>
          setAiError(
            err.message || "Gemini explanation unavailable. Showing verified rule explanation."
          )
        )
        .finally(() => setAiLoading(false));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate optimized block schedule.");
      setPlan(null);
    } finally {
      setOptimizing(false);
    }
  }, [selectedTaskIds]);

  const handleApprovePlan = useCallback(async () => {
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
  }, [plan, loadTasks, onPlanApproved]);

  const handleReject = useCallback(() => {
    setPlan(null);
    setApprovalSuccess(null);
    setAiExplanation(null);
    setAiError(null);
    setError(null);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="bg-[#071F4D] text-white p-6 rounded-md border border-[#0B3D91] flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
            <Sparkles className="w-4 h-4 text-[#A78BFA]" />
            Rule-Based Coordinated Scheduling Engine
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
            AI Block Optimizer
          </h1>
          <p className="text-xs text-[#CBD5E1] mt-1 max-w-2xl">
            Select pending maintenance requests to evaluate physical corridor compatibility,
            safety clearances, and greedily bundle tasks into minimal COA block windows.
          </p>
        </div>

        {/* Quick selection shortcuts */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSelectSeedDemo}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md bg-[#0B3D91] hover:bg-[#1976D2] text-white border border-[#1976D2]/40 transition-all cursor-pointer shadow-xs"
          >
            Select Seed Demo (T001, T002, T003)
          </button>
          <button
            onClick={handleSelectAll}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md bg-[#071F4D] hover:bg-[#0B3D91] text-[#CBD5E1] hover:text-white border border-[#1976D2]/30 transition-all cursor-pointer shadow-xs"
          >
            Select All ({tasks.length})
          </button>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {error && (
        <div className="p-4 bg-[#FEF2F2] border-l-4 border-[#DC2626] rounded-r-md text-xs text-[#991B1B] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-[#991B1B] font-bold text-sm px-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {approvalSuccess && (
        <div className="p-4 bg-[#F0FDF4] border-l-4 border-[#16A34A] rounded-r-md text-xs text-[#166534] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0" />
            <div>
              <span className="font-bold uppercase text-[11px] block text-[#15803D]">
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
          <div className="bg-white border border-[#CBD5E1] rounded-md shadow-sm overflow-hidden">
            <div className="bg-[#0B3D91] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-300" />
                <h2 className="text-xs font-bold uppercase tracking-wider">
                  Pending Intake Queue ({selectedTaskIds.length}/{tasks.length} Selected)
                </h2>
              </div>
              <span className="text-[10px] text-[#CBD5E1] font-mono">
                Click to toggle
              </span>
            </div>

            <div className="divide-y divide-[#E2E8F0] max-h-[550px] overflow-y-auto p-2 space-y-1">
              {loading ? (
                // 3 Skeleton Task Cards during fetch
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-2 animate-pulse"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#CBD5E1] rounded" />
                        <div className="w-12 h-4 bg-[#CBD5E1] rounded-md" />
                        <div className="w-16 h-4 bg-[#CBD5E1] rounded-md" />
                      </div>
                      <div className="w-14 h-4 bg-[#CBD5E1] rounded-md" />
                    </div>
                    <div className="pl-6 space-y-1.5">
                      <div className="w-3/4 h-3.5 bg-[#CBD5E1] rounded" />
                      <div className="w-1/2 h-3 bg-[#E2E8F0] rounded" />
                      <div className="flex items-center justify-between pt-1">
                        <div className="w-24 h-3 bg-[#E2E8F0] rounded" />
                        <div className="w-8 h-3 bg-[#E2E8F0] rounded" />
                      </div>
                    </div>
                  </div>
                ))
              ) : tasks.length === 0 ? (
                // Actionable Empty State
                <div className="p-8 text-center text-xs text-[#64748B] flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-[#1E293B]">No pending maintenance requests</span>
                  <p className="text-[11px] text-[#64748B] max-w-xs">
                    All tasks have been scheduled into approved block plans. Click "Reload Tasks" to check for updates.
                  </p>
                  <button
                    onClick={loadTasks}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B3D91] hover:bg-[#1976D2] text-white rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reload Tasks
                  </button>
                </div>
              ) : (
                tasks.map((task) => {
                  const isChecked = selectedTaskIds.includes(task.id);
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`p-3 rounded-md border transition-all cursor-pointer select-none ${
                        isChecked
                          ? "bg-[#F5F3FF] border-[#7C3AED]/40 shadow-xs"
                          : "bg-white border-transparent hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 accent-[#1976D2] rounded cursor-pointer"
                          />
                          <span className="font-mono font-bold text-xs text-[#071F4D]">
                            {task.id}
                          </span>
                          <DepartmentBadge department={task.department} />
                        </div>
                        <PriorityBadge priority={task.priority} />
                      </div>

                      <div className="mt-2 pl-6">
                        <div className="text-xs font-bold text-[#1E293B]">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-[#64748B] line-clamp-1">
                          {task.workType}
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[11px] text-[#94A3B8] pt-1 border-t border-[#F1F5F9]">
                          <span className="font-semibold text-[#1E293B]">
                            {task.corridor} • {task.section.split("(")[0]}
                          </span>
                          <span className="font-mono font-bold text-[#1E293B] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#1976D2]" />
                            {task.durationHours}h
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Action Trigger Button (Sky Blue #1976D2) */}
            <div className="p-3 bg-[#F8FAFC] border-t border-[#CBD5E1]">
              <button
                onClick={handleGeneratePlan}
                disabled={optimizing || selectedTaskIds.length === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1976D2] hover:bg-[#1565C0] disabled:bg-[#94A3B8] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-sm cursor-pointer"
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
          {optimizing ? (
            // Dynamic Optimizing Preview Skeleton
            <div className="bg-white border-2 border-[#7C3AED]/50 rounded-md p-6 space-y-5 shadow-sm animate-pulse">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#7C3AED] animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
                    Evaluating Multi-Department Compatibility & Possessions...
                  </span>
                </div>
                <div className="h-6 w-20 bg-[#CBD5E1] rounded-md" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8FAFC] p-3 rounded-md border border-[#E2E8F0]">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-2.5 w-12 bg-[#CBD5E1] rounded" />
                    <div className="h-4 w-20 bg-[#CBD5E1] rounded" />
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 w-44 bg-[#CBD5E1] rounded" />
                <div className="h-12 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]" />
                <div className="h-12 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]" />
              </div>
            </div>
          ) : !plan ? (
            <div className="bg-white border border-[#CBD5E1] rounded-md p-8 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto text-[#94A3B8]">
                <GitMerge className="w-6 h-6 text-[#1976D2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E293B]">
                  No Optimization Plan Generated Yet
                </h3>
                <p className="mt-1 text-xs text-[#64748B] max-w-md mx-auto">
                  Select maintenance requests on the left (e.g. Seed tasks T001, T002, T003)
                  and click "Generate Optimized Plan" to run rule-based compatibility scoring
                  and greedy block packing.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Recommended Coordinated Block Card (AI Purple #7C3AED Accent) */}
              <div className="bg-white border-2 border-[#7C3AED] rounded-md shadow-sm overflow-hidden">
                <div className="bg-[#071F4D] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#0B3D91]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-ping"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Recommended Coordinated Block
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[#0B3D91] text-purple-200 border border-[#7C3AED]/50 font-bold">
                      {plan.blockId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-purple-200 uppercase">Score:</span>
                    <span className="font-mono font-bold text-white bg-[#7C3AED] px-2.5 py-0.5 rounded-md shadow-xs">
                      {plan.compatibilityScore} / 100
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Block Window Metadata */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F8FAFC] p-3 rounded-md border border-[#E2E8F0]">
                    <div>
                      <span className="text-[#64748B] uppercase text-[10px] block font-semibold">Corridor</span>
                      <span className="font-bold text-[#1E293B]">{plan.corridor}</span>
                      <span className="text-[10px] text-[#64748B] block truncate">{plan.corridorName}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] uppercase text-[10px] block font-semibold">Section</span>
                      <span className="font-bold text-[#1E293B] truncate block">{plan.section}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] uppercase text-[10px] block font-semibold">Window Hours</span>
                      <span className="font-mono font-bold text-[#1E293B]">
                        {plan.totalDuration}h / {plan.maxWindowHours}h Cap
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] uppercase text-[10px] block font-semibold">Scheduled Date</span>
                      <span className="font-mono font-bold text-[#1E293B]">{plan.date}</span>
                    </div>
                  </div>

                  {/* Combined Tasks List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-2">
                      Tasks Combined in this Coordinated Possession ({plan.assignedTasks.length})
                    </h4>
                    <div className="space-y-2">
                      {plan.assignedTasks.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-[#071F4D]">{t.id}</span>
                            <DepartmentBadge department={t.department} />
                            <div>
                              <span className="font-bold text-[#1E293B]">{t.title}</span>
                              <span className="text-[11px] text-[#64748B] ml-2 hidden sm:inline">
                                {t.workType}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <PriorityBadge priority={t.priority} />
                            <span className="font-mono font-bold text-[#1E293B] bg-[#E2E8F0] px-2 py-0.5 rounded-md">
                              {t.durationHours}h
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explainable AI Component (AI Purple Theme) */}
                  <ExplainabilityCard
                    plan={plan}
                    aiExplanation={aiExplanation}
                    aiLoading={aiLoading}
                    aiError={aiError}
                  />

                  {/* Simulated Scenario Comparison */}
                  <SimulatedComparison comparison={plan.simulatedComparison} />

                  {/* Human-in-the-Loop Approval Action Bar */}
                  <div className="bg-[#F8FAFC] p-4 rounded-md border border-[#CBD5E1] flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3 overflow-hidden">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-xs font-bold uppercase text-[#1E293B]">
                        Human-in-the-Loop Planner Verification
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Review the compatibility breakdown and simulated operational impact before dispatching to COA.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto self-end 2xl:self-center flex-shrink-0">
                      <button
                        onClick={handleReject}
                        className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-md bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1] transition-colors cursor-pointer flex-shrink-0 shadow-xs"
                      >
                        Reset
                      </button>

                      {canApprove ? (
                        <button
                          onClick={handleApprovePlan}
                          disabled={approving}
                          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 text-white shadow-sm transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
                        >
                          <Check className={`w-4 h-4 ${approving ? "animate-spin" : ""}`} />
                          <span>{approving ? "Approving..." : "Approve & Schedule Plan"}</span>
                        </button>
                      ) : (
                        <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                          Controller approval required
                        </span>
                      )}
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

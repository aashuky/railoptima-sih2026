import React, { useState } from "react";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Optimizer from "./pages/Optimizer";
import BlockPlans from "./pages/BlockPlans";
import { ShieldCheck, RotateCcw } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTaskIdsForOptimizer, setSelectedTaskIdsForOptimizer] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNavigateToOptimizer = (taskIds = []) => {
    setSelectedTaskIdsForOptimizer(taskIds);
    setActiveTab("optimizer");
  };

  const handleResetComplete = () => {
    setRefreshKey((k) => k + 1);
    setSelectedTaskIdsForOptimizer([]);
  };

  const handlePlanApproved = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col font-sans text-[#312F30]">
      {/* Global Navigation Header with Rehearsal Reset Control */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetComplete={handleResetComplete}
      />

      {/* Main Content Area */}
      <main className="flex-1" key={refreshKey}>
        {activeTab === "dashboard" && (
          <Dashboard onNavigateToOptimizer={handleNavigateToOptimizer} />
        )}
        {activeTab === "optimizer" && (
          <Optimizer
            initialTaskIds={selectedTaskIdsForOptimizer}
            onPlanApproved={handlePlanApproved}
          />
        )}
        {activeTab === "plans" && <BlockPlans />}
      </main>

      {/* Operational Footer */}
      <footer className="bg-[#111111] text-[#999999] border-t border-[#312F30] py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white uppercase tracking-wider">
              Rail<span className="text-[#ED1B24]">Optima</span>
            </span>
            <span className="text-[#555555]">|</span>
            <span>Indian Railways • Smart India Hackathon 2026</span>
            <span className="text-[#555555]">|</span>
            <span className="text-[#CCCCCC]">Problem Statement ID: 26027</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#777777]">
            <span>COA Integration: Simulated Gateway</span>
            <span>•</span>
            <span>BDMS Normalization: Active</span>
            <span>•</span>
            <span className="text-emerald-400">System Healthy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

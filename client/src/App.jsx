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
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans text-[#1E293B]">
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
      <footer className="bg-[#172033] text-[#94A3B8] border-t border-[#071F4D] py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white uppercase tracking-wider">
              Rail<span className="text-[#1976D2]">Optima</span>
            </span>
            <span className="text-[#475569]">|</span>
            <span>Indian Railways • Smart India Hackathon 2026</span>
            <span className="text-[#475569]">|</span>
            <span className="text-[#CBD5E1]">Problem Statement ID: 26027</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#94A3B8]">
            <span>COA Integration: Simulated Gateway</span>
            <span>•</span>
            <span>BDMS Normalization: Active</span>
            <span>•</span>
            <span className="text-[#16A34A] font-semibold">System Healthy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

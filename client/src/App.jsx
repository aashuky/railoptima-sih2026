import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Optimizer from "./pages/Optimizer";
import BlockPlans from "./pages/BlockPlans";
import Login from "./pages/Login";
import { ShieldCheck, RotateCcw } from "lucide-react";

export default function App() {
  // Always start from the login page on app launch
  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTaskIdsForOptimizer, setSelectedTaskIdsForOptimizer] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const handleNavigateToOptimizer = (taskIds = []) => {
    setSelectedTaskIdsForOptimizer(taskIds);
    setActiveTab("optimizer");
  };

  const handleNavigateToTab = (tab, taskIds = []) => {
    if (taskIds && taskIds.length > 0) {
      setSelectedTaskIdsForOptimizer(taskIds);
    }
    setActiveTab(tab);
  };

  const handleResetComplete = () => {
    setRefreshKey((k) => k + 1);
    setSelectedTaskIdsForOptimizer([]);
  };

  const handlePlanApproved = () => {
    setRefreshKey((k) => k + 1);
  };

  // Render Login screen if user is not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans text-[#1E293B]">
      {/* Global Navigation Header with Rehearsal Reset Control */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetComplete={handleResetComplete}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area with Smooth Page Transition */}
      <main className="flex-1" key={refreshKey}>
        <div key={activeTab} className="animate-page-enter">
          {activeTab === "dashboard" && (
            <Dashboard
              onNavigateToOptimizer={handleNavigateToOptimizer}
              onNavigateToTab={handleNavigateToTab}
            />
          )}
          {activeTab === "optimizer" && (
            <Optimizer
              initialTaskIds={selectedTaskIdsForOptimizer}
              onPlanApproved={handlePlanApproved}
            />
          )}
          {activeTab === "plans" && <BlockPlans />}
        </div>
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

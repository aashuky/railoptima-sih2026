import React, { useState, useEffect, Suspense } from "react";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Optimizer from "./pages/Optimizer";
import BlockPlans from "./pages/BlockPlans";
import Login from "./pages/Login";
import { ShieldCheck, RotateCcw } from "lucide-react";
import { fetchCurrentUser } from "./services/api";

// Lazy-load the Map tab to keep bundle small and page switches snappy
const CorridorMap = React.lazy(() => import("./pages/CorridorMap"));

function MapSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="h-16 bg-white border border-[#CBD5E1] rounded-md animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-white border border-[#CBD5E1] rounded-md animate-pulse" />
        ))}
      </div>
      <div className="h-[540px] bg-white border border-[#CBD5E1] rounded-md flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#1976D2] border-t-transparent animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#071F4D]">
            Loading Railway Telemetry Map...
          </span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTaskIdsForOptimizer, setSelectedTaskIdsForOptimizer] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("railoptima_token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("railoptima_token");
    if (!token) {
      setAuthChecking(false);
      return;
    }

    fetchCurrentUser(token)
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem("railoptima_token"))
      .finally(() => setAuthChecking(false));
  }, []);

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

  // Checking session
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#071F4D] flex flex-col items-center justify-center gap-4 text-white">
        <div className="h-12 w-12 rounded-xl border border-blue-300/30 bg-[#0B3D91] p-3 shadow-lg motion-lift">
          <ShieldCheck className="h-full w-full animate-pulse text-sky-300" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">Checking secure session</p>
      </div>
    );
  }

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
              user={user}
              onNavigateToOptimizer={handleNavigateToOptimizer}
              onNavigateToTab={handleNavigateToTab}
            />
          )}
          {activeTab === "map" && (
            <Suspense fallback={<MapSkeleton />}>
              <CorridorMap
                user={user}
                onNavigateToOptimizer={handleNavigateToOptimizer}
              />
            </Suspense>
          )}
          {activeTab === "optimizer" && (
            <Optimizer
              user={user}
              initialTaskIds={selectedTaskIdsForOptimizer}
              onPlanApproved={handlePlanApproved}
            />
          )}
          {activeTab === "plans" && <BlockPlans user={user} />}
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

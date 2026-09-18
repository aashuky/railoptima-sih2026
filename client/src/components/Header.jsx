import React, { useState } from "react";
import { RotateCcw, Activity, ShieldCheck, Layers, GitMerge, CalendarDays, LogOut, User, MapPin } from "lucide-react";
import { resetDemoData } from "../services/api";
import logoCircle from "../assets/logo-circle.jpg";

export default function Header({ activeTab, setActiveTab, onResetComplete, user, onLogout }) {
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  const handleReset = async () => {
    try {
      setResetting(true);
      const res = await resetDemoData();
      setResetMessage(res.message || "Demo data restored to initial September 2026 seed state.");
      if (onResetComplete) onResetComplete();
      setTimeout(() => setResetMessage(null), 4000);
    } catch (err) {
      console.error(err);
      alert("Failed to reset demo data: " + err.message);
    } finally {
      setResetting(false);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Layers },
    { id: "map", label: "Corridor Map", icon: MapPin },
    { id: "optimizer", label: "AI Block Optimizer", icon: GitMerge },
    { id: "plans", label: "Block Plans", icon: CalendarDays }
  ];

  return (
    <header className="bg-[#0B3D91] text-white border-b border-[#071F4D] sticky top-0 z-40 shadow-sm">
      {/* Top micro-bar: Indian Railways / CRIS authority identifier */}
      <div className="bg-[#071F4D] border-b border-[#0B3D91]/50 px-4 py-1.5 flex items-center justify-between text-xs text-[#CBD5E1]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold tracking-widest text-[#E2E8F0] uppercase">
            <span className="inline-block w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            Indian Railways
          </span>
          <span className="text-blue-300/40">|</span>
          <span className="tracking-wider">CENTRE FOR RAILWAY INFORMATION SYSTEMS (CRIS)</span>
          <span className="text-blue-300/40">|</span>
          <span className="text-[#E2E8F0]">Control Office Application (COA) / BDMS Gateway</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[#E2E8F0]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1976D2]" />
            COA Horizon: Sept 2026
          </span>
          <span className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
            <Activity className="w-3.5 h-3.5" />
            Operational
          </span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Title */}
          <div className="flex items-center gap-3">
            <img
              src={logoCircle}
              alt="RailOptima Emblem"
              className="w-11 h-11 rounded-full object-cover shadow-md border border-[#1976D2]/60 bg-white p-0.5 flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white uppercase">
                  Rail<span className="text-sky-300">Optima</span>
                </span>
                <span className="bg-[#071F4D] text-[#E2E8F0] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#1976D2]/40">
                  v1.0-SIH
                </span>
              </div>
              <p className="text-[11px] text-[#CBD5E1] tracking-wider uppercase font-medium">
                AI-Powered Maintenance Block Planning
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-stretch gap-1 bg-[#071F4D] p-1 rounded border border-[#0B3D91]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isOptimizer = item.id === "optimizer";
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all text-center self-stretch ${
                    isActive
                      ? isOptimizer
                        ? "bg-[#7C3AED] text-white shadow-sm"
                        : "bg-[#1976D2] text-white shadow-sm"
                      : isOptimizer
                      ? "text-[#E9D5FF] hover:text-white hover:bg-[#7C3AED]/20"
                      : "text-[#CBD5E1] hover:text-white hover:bg-[#0B3D91]/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isOptimizer && !isActive ? "text-[#C4B5FD]" : ""}`} />
                  <span className="leading-tight text-center">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Rehearsal Reset Demo Data Button & User Controls */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#071F4D] rounded border border-[#0B3D91] text-xs">
                <div className="w-6 h-6 rounded-full bg-[#1976D2] flex items-center justify-center text-white font-bold text-[10px]">
                  {user.employeeId ? user.employeeId.slice(-2) : "IR"}
                </div>
                <div className="text-left leading-tight">
                  <div className="text-[#E2E8F0] font-semibold text-[11px] truncate max-w-[140px]">{user.name || user.employeeId}</div>
                  <div className="text-[#94A3B8] text-[9.5px] uppercase tracking-wider">{user.role || "Controller"}</div>
                </div>
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={resetting}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#071F4D] hover:bg-[#1976D2] border border-[#1976D2]/50 hover:border-[#1976D2] rounded transition-all disabled:opacity-50 cursor-pointer"
              title="Restores seed tasks (T001, T002, T003) and blocks to initial demo state"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{resetting ? "Resetting..." : "Reset Demo Data"}</span>
              <span className="sm:hidden">Reset</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#CBD5E1] hover:text-white bg-[#071F4D] hover:bg-[#DC2626]/80 border border-[#1976D2]/40 hover:border-[#DC2626] rounded transition-all cursor-pointer"
                title="Sign out of RailOptima session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation notification banner if reset was triggered */}
      {resetMessage && (
        <div className="bg-[#16A34A] text-white px-4 py-1.5 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-inner">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{resetMessage}</span>
        </div>
      )}
    </header>
  );
}

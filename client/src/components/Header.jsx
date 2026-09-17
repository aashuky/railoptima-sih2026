import React, { useState } from "react";
import { RotateCcw, Activity, ShieldCheck, Layers, GitMerge, CalendarDays } from "lucide-react";
import { resetDemoData } from "../services/api";

export default function Header({ activeTab, setActiveTab, onResetComplete }) {
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
    { id: "optimizer", label: "AI Block Optimizer", icon: GitMerge },
    { id: "plans", label: "Block Plans", icon: CalendarDays }
  ];

  return (
    <header className="bg-[#111111] text-white border-b border-[#312F30] sticky top-0 z-40">
      {/* Top micro-bar: Indian Railways / CRIS authority identifier */}
      <div className="bg-[#1C1A1B] border-b border-[#2B292A] px-4 py-1.5 flex items-center justify-between text-xs text-[#999999]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold tracking-widest text-[#CCCCCC] uppercase">
            <span className="inline-block w-2 h-2 rounded-full bg-[#ED1B24] animate-pulse"></span>
            Indian Railways
          </span>
          <span className="text-[#666666]">|</span>
          <span className="tracking-wider">CENTRE FOR RAILWAY INFORMATION SYSTEMS (CRIS)</span>
          <span className="text-[#666666]">|</span>
          <span className="text-[#CCCCCC]">Control Office Application (COA) / BDMS Gateway</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[#CCCCCC]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ED1B24]" />
            COA Horizon: Sept 2026
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
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
            <div className="w-10 h-10 bg-[#ED1B24] rounded flex items-center justify-center font-black text-white text-xl tracking-tighter shadow-md">
              RO
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white uppercase">
                  Rail<span className="text-[#ED1B24]">Optima</span>
                </span>
                <span className="bg-[#312F30] text-[#CCCCCC] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#444]">
                  v1.0-SIH
                </span>
              </div>
              <p className="text-[11px] text-[#999999] tracking-wider uppercase font-medium">
                AI-Powered Maintenance Block Planning
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-[#1C1A1B] p-1 rounded border border-[#312F30]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                    isActive
                      ? "bg-[#ED1B24] text-white shadow-sm"
                      : "text-[#CCCCCC] hover:text-white hover:bg-[#2A2829]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Rehearsal Reset Demo Data Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              disabled={resetting}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#312F30] hover:bg-[#B52229] border border-[#4A4749] hover:border-[#ED1B24] rounded transition-all disabled:opacity-50"
              title="Restores seed tasks (T001, T002, T003) and blocks to initial demo state"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
              {resetting ? "Resetting..." : "Reset Demo Data"}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation notification banner if reset was triggered */}
      {resetMessage && (
        <div className="bg-[#ED1B24] text-white px-4 py-1.5 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-inner">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{resetMessage}</span>
        </div>
      )}
    </header>
  );
}

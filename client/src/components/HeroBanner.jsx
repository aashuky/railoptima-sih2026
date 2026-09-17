import React from "react";
import { RAILWAY_ASSETS } from "../assets/railwayImages";
import { Zap, Radio, GitPullRequest } from "lucide-react";

export default function HeroBanner({ onQuickOptimize }) {
  return (
    <div className="relative bg-[#111111] text-white border-b border-[#312F30] overflow-hidden">
      {/* Background Infrastructure Photo with Disciplined Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 transform duration-700"
        style={{
          backgroundImage: `url('${RAILWAY_ASSETS.corridorHero}')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/90 to-[#111111]/70" />

      {/* Subtle Animated Train & Track Silhouette Layer (Signal Red Dominant, 32% Opacity, Glowing Outline) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Faint Dashed Track Line across the entire width */}
        <div className="absolute inset-x-0 bottom-4 flex flex-col justify-end opacity-35">
          <div className="w-full h-px border-b-2 border-dashed border-[#ED1B24]" />
          <div className="w-full h-[1px] bg-[#CCCCCC]/35 mt-[2px]" />
        </div>

        {/* Train Silhouette moving continuously left-to-right on loop */}
        <div
          className="absolute bottom-4 animate-train opacity-[0.32] pointer-events-none select-none"
          style={{
            filter: "drop-shadow(0 0 8px rgba(237, 27, 36, 0.45))"
          }}
        >
          <svg
            width="1150"
            height="105"
            viewBox="0 0 460 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[1150px] h-[105px]"
          >
            {/* Pantograph (Signal Red #ED1B24 with Light Contrast Tips) */}
            <path
              d="M 395 10 L 406 2 L 418 2 L 428 10"
              stroke="#ED1B24"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <line
              x1="400"
              y1="2"
              x2="424"
              y2="2"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line x1="408" y1="5" x2="416" y2="5" stroke="#ED1B24" strokeWidth="1.25" />

            {/* Locomotive Body (DOMINANT Signal Red #ED1B24 with crisp light-red stroke outline) */}
            <path
              d="M 320 10 L 434 10 Q 450 14 450 28 L 450 35 L 320 35 Z"
              fill="#ED1B24"
              stroke="rgba(255, 180, 180, 0.6)"
              strokeWidth="0.8"
            />
            {/* Locomotive Deep Red Livery Trim (#B52229) */}
            <path d="M 320 22 L 448 22 L 447 26 L 320 26 Z" fill="#B52229" />
            {/* Underframe Rail Guard (Near-black #111111) */}
            <rect x="320" y="33" width="128" height="2" fill="#111111" />

            {/* Cab Window & Side Grilles (Near-black #111111 details) */}
            <polygon points="426,13 442,15 440,20 426,20" fill="#111111" stroke="#312F30" strokeWidth="0.5" />
            <rect x="340" y="14" width="16" height="5" rx="1" fill="#111111" />
            <rect x="365" y="14" width="16" height="5" rx="1" fill="#111111" />
            <rect x="390" y="14" width="16" height="5" rx="1" fill="#111111" />
            {/* Front Headlamp Glow */}
            <circle cx="448" cy="24" r="1.75" fill="#FFFFFF" />

            {/* Locomotive Bogie Wheels (Near-black #111111 with Charcoal rims) */}
            <circle cx="336" cy="38.5" r="3.5" fill="#111111" stroke="#444444" strokeWidth="1.25" />
            <circle cx="352" cy="38.5" r="3.5" fill="#111111" stroke="#444444" strokeWidth="1.25" />
            <circle cx="416" cy="38.5" r="3.5" fill="#111111" stroke="#444444" strokeWidth="1.25" />
            <circle cx="432" cy="38.5" r="3.5" fill="#111111" stroke="#444444" strokeWidth="1.25" />

            {/* Coupler 1 (Near-black #111111) */}
            <rect x="312" y="27" width="8" height="3" rx="0.5" fill="#111111" />

            {/* Coach 1 Body (DOMINANT Signal Red #ED1B24 with crisp light-red stroke outline) */}
            <rect
              x="165"
              y="12"
              width="147"
              height="23"
              rx="2"
              fill="#ED1B24"
              stroke="rgba(255, 180, 180, 0.6)"
              strokeWidth="0.8"
            />
            {/* Coach 1 Deep Red Livery Band (#B52229) */}
            <rect x="165" y="22" width="147" height="4" fill="#B52229" />
            {/* Underframe Skirt */}
            <rect x="165" y="33" width="147" height="2" fill="#111111" />

            {/* Coach 1 Windows (Near-black #111111 cutouts) */}
            <rect x="175" y="15" width="14" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />
            <rect x="195" y="15" width="14" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />
            <rect x="215" y="15" width="14" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />
            <rect x="235" y="15" width="14" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />
            <rect x="255" y="15" width="14" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />
            <rect x="275" y="15" width="14" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />
            <rect x="295" y="15" width="10" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />

            {/* Coach 1 Bogie Wheels (Near-black #111111 with Charcoal rims) */}
            <circle cx="180" cy="38.5" r="3.5" fill="#111111" stroke="#444444" strokeWidth="1.25" />
            <circle cx="196" cy="38.5" r="3.5" fill="#111111" stroke="#444444" strokeWidth="1.25" />
            <circle cx="280" cy="38.5" r="3.5" fill="#111111" stroke="#444444" strokeWidth="1.25" />
            <circle cx="296" cy="38.5" r="3.5" fill="#111111" stroke="#444444" strokeWidth="1.25" />

            {/* Coupler 2 (Near-black #111111) */}
            <rect x="157" y="27" width="8" height="3" rx="0.5" fill="#111111" />

            {/* Coach 2 Body (DOMINANT Signal Red #ED1B24 with crisp light-red stroke outline) */}
            <rect
              x="10"
              y="12"
              width="147"
              height="23"
              rx="2"
              fill="#ED1B24"
              stroke="rgba(255, 180, 180, 0.6)"
              strokeWidth="0.8"
            />
            {/* Coach 2 Deep Red Livery Band (#B52229) */}
            <rect x="10" y="22" width="147" height="4" fill="#B52229" />
            {/* Underframe Skirt */}
            <rect x="10" y="33" width="147" height="2" fill="#111111" />

            {/* Coach 2 Windows (Near-black #111111 cutouts) */}
            <rect x="20" y="15" width="14" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />
            <rect x="40" y="15" width="14" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />
            <rect x="60" y="15" width="14" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />
            <rect x="80" y="15" width="14" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />
            <rect x="100" y="15" width="14" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />
            <rect x="120" y="15" width="14" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />
            <rect x="140" y="15" width="10" height="5" rx="1" fill="#111111" stroke="#222" strokeWidth="0.5" />

            {/* Coach 2 Bogie Wheels (Near-black #111111 with Charcoal rims) */}
            <circle cx="25" cy="38.5" r="3.5" fill="#111111" stroke="#444444" strokeWidth="1.25" />
            <circle cx="41" cy="38.5" r="3.5" fill="#111111" stroke="#444444" strokeWidth="1.25" />
            <circle cx="125" cy="38.5" r="3.5" fill="#111111" stroke="#444444" strokeWidth="1.25" />
            <circle cx="141" cy="38.5" r="3.5" fill="#111111" stroke="#444444" strokeWidth="1.25" />
          </svg>
        </div>
      </div>

      {/* Hero Content (z-10 ensures it renders strictly above the train animation) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#312F30] border border-[#444] text-[#CCCCCC] text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-[#ED1B24]"></span>
              High-Density Network Optimization
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans">
              AI-COORDINATED BLOCK PLANNING
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#CCCCCC] max-w-3xl leading-relaxed">
              Consolidating independent maintenance requests from Track (TMS), Signalling (SMMS),
              and Traction Distribution (TDMS) into synchronized line possessions to maximize corridor
              asset availability and eliminate redundant train disruptions.
            </p>

            {/* Tri-Department Integration Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#CCCCCC]">
              <span className="flex items-center gap-1.5 bg-[#1C1A1B] px-3 py-1.5 rounded border border-[#312F30]">
                <span className="w-2 h-2 rounded-full bg-[#0284C7]"></span>
                TMS: Track & Civil Engineering
              </span>
              <span className="flex items-center gap-1.5 bg-[#1C1A1B] px-3 py-1.5 rounded border border-[#312F30]">
                <Radio className="w-3.5 h-3.5 text-[#38BDF8]" />
                SMMS: Signal & Interlocking
              </span>
              <span className="flex items-center gap-1.5 bg-[#1C1A1B] px-3 py-1.5 rounded border border-[#312F30]">
                <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                TDMS: 25kV OHE Catenary
              </span>
            </div>
          </div>

          {/* Operational Corridor Snapshot */}
          <div className="lg:col-span-4 bg-[#1C1A1B]/95 p-4 rounded border border-[#312F30] shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2829]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#999999]">
                Active Pilot Corridor
              </span>
              <span className="text-xs font-bold text-[#ED1B24] uppercase">
                Corridor C01
              </span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between text-[#CCCCCC]">
                <span className="text-[#999999]">Section:</span>
                <span className="font-semibold text-white">Simulated Section Alpha–Beta</span>
              </div>
              <div className="flex justify-between text-[#CCCCCC]">
                <span className="text-[#999999]">Next Available Block:</span>
                <span className="font-mono text-emerald-400 font-bold">BLK-C01-01 (4.0h)</span>
              </div>
              <div className="flex justify-between text-[#CCCCCC]">
                <span className="text-[#999999]">Compatible In-Queue:</span>
                <span className="font-bold text-white">T001, T002, T003</span>
              </div>
            </div>

            <button
              onClick={onQuickOptimize}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold uppercase tracking-wider text-white bg-[#ED1B24] hover:bg-[#B52229] rounded transition-all shadow-sm cursor-pointer"
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              Open AI Block Optimizer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

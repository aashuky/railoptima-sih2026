import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchCorridors, fetchMaintenanceTasks, fetchBlocks } from "../services/api";
import {
  MapPin,
  Filter,
  RefreshCw,
  AlertTriangle,
  Layers,
  Sparkles,
  Train,
  CheckCircle2,
  Clock,
  SlidersHorizontal,
  ChevronRight,
  Maximize2,
  ShieldAlert,
  Calendar,
  AlertCircle,
  HelpCircle,
  X
} from "lucide-react";

// Department Visual Styling
const DEPT_COLORS = {
  TMS: {
    bg: "#071F4D",
    text: "#FFFFFF",
    border: "#0B3D91",
    label: "Track (TMS)",
    short: "TMS"
  },
  SMMS: {
    bg: "#1976D2",
    text: "#FFFFFF",
    border: "#1565C0",
    label: "Signals (SMMS)",
    short: "SMMS"
  },
  TDMS: {
    bg: "#D97706",
    text: "#FFFFFF",
    border: "#B45309",
    label: "Traction (TDMS)",
    short: "TDMS"
  }
};

// Priority Visual Styling
const PRIORITY_STYLES = {
  High: {
    ringColor: "#DC2626",
    pulseClass: "animate-pulse",
    badgeBg: "bg-red-100 text-red-700 border-red-200"
  },
  Medium: {
    ringColor: "#F59E0B",
    pulseClass: "",
    badgeBg: "bg-amber-100 text-amber-800 border-amber-200"
  },
  Low: {
    ringColor: "#64748B",
    pulseClass: "",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200"
  }
};

// Corridor Status Styling
const STATUS_COLORS = {
  "Free": {
    stroke: "#16A34A",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-300",
    dot: "bg-[#16A34A]",
    desc: "Open track, normal traffic flow"
  },
  "Planned Block": {
    stroke: "#F59E0B",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-300",
    dot: "bg-[#F59E0B]",
    desc: "Scheduled COA possession window"
  },
  "Blocked Now": {
    stroke: "#DC2626",
    badgeBg: "bg-red-50 text-red-700 border-red-300",
    dot: "bg-[#DC2626]",
    desc: "Active line closure & maintenance"
  }
};

export default function CorridorMap({ onNavigateToOptimizer }) {
  const [corridors, setCorridors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [corridorFilter, setCorridorFilter] = useState("ALL");
  const [timeframeFilter, setTimeframeFilter] = useState("ALL"); // ALL | overdue | week

  // UI States
  const [selectedTask, setSelectedTask] = useState(null);
  const [legendOpen, setLegendOpen] = useState(true);

  // Map DOM & Instance Refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polylinesLayerGroupRef = useRef(null);
  const stationsLayerGroupRef = useRef(null);
  const markersLayerGroupRef = useRef(null);

  // Fetch operational map data
  const loadMapData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [corrRes, taskRes, blkRes] = await Promise.all([
        fetchCorridors(),
        fetchMaintenanceTasks(),
        fetchBlocks()
      ]);
      setCorridors(corrRes.corridors || []);
      setTasks(taskRes.tasks || []);
      setBlocks(blkRes.blocks || []);
    } catch (err) {
      console.error("Failed to load map data:", err);
      setError(err.message || "Failed to load railway corridor and task telemetry");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

  // Compute live Corridor Block Status
  const corridorStatusMap = useMemo(() => {
    const map = {};
    corridors.forEach((c) => {
      const cBlocks = blocks.filter((b) => b.corridor === c.id);
      const hasActive = cBlocks.some(
        (b) => b.status === "Blocked Now" || b.status === "Active" || b.status === "In Progress"
      );
      const hasScheduled = cBlocks.some(
        (b) => b.status === "Scheduled" || b.status === "Planned"
      );

      if (c.blockStatus === "Blocked Now" || hasActive) {
        map[c.id] = "Blocked Now";
      } else if (c.blockStatus === "Planned Block" || hasScheduled) {
        map[c.id] = "Planned Block";
      } else {
        map[c.id] = "Free";
      }
    });
    return map;
  }, [corridors, blocks]);

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (deptFilter !== "ALL" && t.department !== deptFilter) return false;
      if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;
      if (corridorFilter !== "ALL" && t.corridor !== corridorFilter) return false;
      if (timeframeFilter === "overdue" && (!t.overdueDays || t.overdueDays <= 0)) return false;
      if (timeframeFilter === "week") {
        if (t.requestedDate) {
          const req = new Date(t.requestedDate);
          const limit = new Date("2026-09-22T23:59:59Z");
          if (req > limit) return false;
        }
      }
      return true;
    });
  }, [tasks, deptFilter, priorityFilter, corridorFilter, timeframeFilter]);

  // Summary Metrics
  const metrics = useMemo(() => {
    let freeCount = 0;
    let plannedCount = 0;
    let blockedCount = 0;

    corridors.forEach((c) => {
      const status = corridorStatusMap[c.id] || "Free";
      if (status === "Free") freeCount++;
      else if (status === "Planned Block") plannedCount++;
      else if (status === "Blocked Now") blockedCount++;
    });

    const highPriorityTasks = filteredTasks.filter((t) => t.priority === "High").length;
    const overdueTasks = filteredTasks.filter((t) => t.overdueDays && t.overdueDays > 0).length;

    return {
      corridorsCount: corridors.length,
      freeCount,
      plannedCount,
      blockedCount,
      tasksCount: filteredTasks.length,
      highPriorityTasks,
      overdueTasks
    };
  }, [corridors, corridorStatusMap, filteredTasks]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center over central/northern Indian rail network
    const map = L.map(mapContainerRef.current, {
      center: [23.8, 76.8],
      zoom: 6,
      minZoom: 4,
      maxZoom: 17,
      zoomControl: true,
      attributionControl: true
    });

    // OpenStreetMap standard tiles (No API key required)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | CRIS BDMS',
      maxZoom: 19
    }).addTo(map);

    // Initialize layer groups for clean dynamic updates
    polylinesLayerGroupRef.current = L.layerGroup().addTo(map);
    stationsLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Handle "Optimize with AI" click from inside Leaflet popup HTML
    map.on("popupopen", (e) => {
      const popupEl = e.popup.getElement();
      if (!popupEl) return;
      const optBtn = popupEl.querySelector(".map-optimize-btn");
      if (optBtn) {
        optBtn.onclick = () => {
          const taskId = optBtn.getAttribute("data-task-id");
          if (taskId && onNavigateToOptimizer) {
            onNavigateToOptimizer([taskId]);
          }
        };
      }
    });

    // Fix blank/grey tile rendering on initial tab switch
    const timer1 = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 400);

    // Attach ResizeObserver to keep tiles crisp upon resize
    let resizeObserver = null;
    if (window.ResizeObserver && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (resizeObserver) resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onNavigateToOptimizer]);

  // Tab switch or container visibility re-invalidation
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
    }
  });

  // Render Corridor Polylines & Stations
  useEffect(() => {
    if (!mapInstanceRef.current || !polylinesLayerGroupRef.current || !stationsLayerGroupRef.current) {
      return;
    }

    polylinesLayerGroupRef.current.clearLayers();
    stationsLayerGroupRef.current.clearLayers();

    if (corridors.length === 0) return;

    const allPoints = [];

    corridors.forEach((corridor) => {
      if (!corridor.coordinates || corridor.coordinates.length === 0) return;

      const status = corridorStatusMap[corridor.id] || "Free";
      const style = STATUS_COLORS[status] || STATUS_COLORS["Free"];

      // Collect points for fitBounds
      corridor.coordinates.forEach((pt) => allPoints.push(pt));

      // Draw Polyline
      const polyline = L.polyline(corridor.coordinates, {
        color: style.stroke,
        weight: 6,
        opacity: 0.9,
        dashArray: status === "Planned Block" ? "8, 6" : undefined,
        lineJoin: "round"
      });

      // Hover feedback
      polyline.on("mouseover", () => {
        polyline.setStyle({ weight: 9, opacity: 1 });
      });
      polyline.on("mouseout", () => {
        polyline.setStyle({ weight: 6, opacity: 0.9 });
      });

      // Count tasks on this corridor
      const corrTasks = tasks.filter((t) => t.corridor === corridor.id);
      const corrBlocks = blocks.filter((b) => b.corridor === corridor.id);

      // Polyline Popup
      const popupHtml = `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; font-size: 12px; color: #1E293B; min-width: 230px; max-width: 280px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 8px;">
            <strong style="color: #071F4D; font-size: 13px;">${corridor.name}</strong>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; background-color: ${style.stroke}22; color: ${style.stroke}; border: 1px solid ${style.stroke}66;">
              ● ${status}
            </span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; margin-bottom: 8px; background: #F8FAFC; padding: 6px; border-radius: 4px; border: 1px solid #E2E8F0;">
            <div><span style="color: #64748B;">Zone:</span> <strong style="color: #071F4D;">${corridor.zone || "IR"}</strong></div>
            <div><span style="color: #64748B;">Speed:</span> <strong style="color: #071F4D;">${corridor.maxSpeedKmH || 130} km/h</strong></div>
            <div><span style="color: #64748B;">Line:</span> <strong style="color: #071F4D;">Double</strong></div>
            <div><span style="color: #64748B;">Traction:</span> <strong style="color: #071F4D;">25kV OHE</strong></div>
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
            <strong>${corrTasks.length}</strong> maintenance tasks pending | <strong>${corrBlocks.length}</strong> total COA windows
          </div>
        </div>
      `;

      polyline.bindPopup(popupHtml);
      polylinesLayerGroupRef.current.addLayer(polyline);

      // Stations markers along corridor
      if (corridor.stations && Array.isArray(corridor.stations)) {
        corridor.stations.forEach((station) => {
          if (!station.coordinates) return;

          const stationMarker = L.circleMarker(station.coordinates, {
            radius: 5,
            fillColor: "#0B3D91",
            color: "#FFFFFF",
            weight: 2,
            fillOpacity: 1
          });

          stationMarker.bindTooltip(
            `<strong>${station.name} (${station.code})</strong><br/><span style="font-size: 10px; color: #64748B;">${corridor.name}</span>`,
            { direction: "top", offset: [0, -4] }
          );

          stationsLayerGroupRef.current.addLayer(stationMarker);
        });
      }
    });

    // Auto-fit initial bounds if not already zoomed
    if (allPoints.length > 0 && mapInstanceRef.current) {
      try {
        const bounds = L.latLngBounds(allPoints);
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
      } catch (err) {
        // Safe catch for edge case bounds
      }
    }
  }, [corridors, corridorStatusMap, tasks, blocks]);

  // Render Maintenance Task Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;

    markersLayerGroupRef.current.clearLayers();

    filteredTasks.forEach((task) => {
      if (!task.coordinates || task.coordinates.length !== 2) return;

      const deptStyle = DEPT_COLORS[task.department] || DEPT_COLORS.TMS;
      const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Low;
      const isHigh = task.priority === "High";

      // Create Custom HTML Marker with Department Color & Priority Indicator Ring
      const markerHtml = `
        <div class="relative group cursor-pointer" style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          ${
            isHigh
              ? `<span class="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60 animate-ping"></span>`
              : ""
          }
          <div style="
            width: 26px;
            height: 26px;
            border-radius: 9999px;
            background-color: ${deptStyle.bg};
            border: 2.5px solid ${priorityStyle.ringColor};
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: -0.5px;
            text-transform: uppercase;
          ">
            ${deptStyle.short}
          </div>
          <span style="
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 9px;
            height: 9px;
            border-radius: 9999px;
            background-color: ${priorityStyle.ringColor};
            border: 1.5px solid #FFFFFF;
          "></span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "custom-task-leaflet-icon",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const marker = L.marker(task.coordinates, { icon: customIcon });

      // Build Rich Interactive Popup HTML
      const overdueNotice =
        task.overdueDays && task.overdueDays > 0
          ? `<span style="color: #DC2626; font-weight: bold;">⚠️ Overdue by ${task.overdueDays} day(s)</span>`
          : `<span style="color: #16A34A; font-weight: 600;">✓ On schedule</span>`;

      // Find assigned block window if any
      const matchingBlock = blocks.find(
        (b) => b.corridor === task.corridor && b.status === "Available"
      );

      const assignedBlockText = matchingBlock
        ? `${matchingBlock.id} (${matchingBlock.durationHours}h slot, ${matchingBlock.date})`
        : "Pending AI Optimization";

      const popupContent = `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; font-size: 12px; color: #1E293B; width: 260px; padding: 2px;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 8px;">
            <div>
              <span style="font-size: 10px; font-weight: bold; color: #64748B; text-transform: uppercase;">${task.id} • ${task.corridor}</span>
              <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #071F4D; line-height: 1.2;">${task.title}</h4>
            </div>
            <span style="padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; background-color: ${priorityStyle.ringColor}15; color: ${priorityStyle.ringColor}; border: 1px solid ${priorityStyle.ringColor}40;">
              ${task.priority}
            </span>
          </div>

          <div style="margin-bottom: 6px; font-size: 11px;">
            <div style="margin-bottom: 2px;"><strong>Department:</strong> <span style="color: ${deptStyle.bg}; font-weight: 600;">${deptStyle.label}</span></div>
            <div style="margin-bottom: 2px;"><strong>Section:</strong> ${task.section || "Mainline"}</div>
            <div style="margin-bottom: 2px;"><strong>Track:</strong> <span style="font-family: monospace; font-size: 10px; background: #F1F5F9; padding: 1px 4px; border-radius: 2px;">${task.trackId || "N/A"}</span></div>
            <div style="margin-bottom: 2px;"><strong>Duration:</strong> ${task.durationHours} hours</div>
            <div style="margin-bottom: 4px;"><strong>Timeline:</strong> ${overdueNotice}</div>
          </div>

          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 6px; margin-bottom: 8px; font-size: 10px;">
            <span style="color: #64748B; display: block; font-weight: 600; text-transform: uppercase; margin-bottom: 2px;">Assigned Block Window</span>
            <span style="color: #0B3D91; font-weight: bold;">${assignedBlockText}</span>
          </div>

          <div style="display: flex; gap: 6px; align-items: center;">
            <button
              class="map-optimize-btn"
              data-task-id="${task.id}"
              style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; background-color: #7C3AED; color: #FFFFFF; border: none; border-radius: 4px; padding: 6px 10px; font-size: 11px; font-weight: bold; cursor: pointer; text-transform: uppercase;"
            >
              <span>⚡ Optimize with AI</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("click", () => {
        setSelectedTask(task);
      });

      markersLayerGroupRef.current.addLayer(marker);
    });
  }, [filteredTasks, blocks]);

  // Reset all filters
  const handleResetFilters = () => {
    setDeptFilter("ALL");
    setPriorityFilter("ALL");
    setCorridorFilter("ALL");
    setTimeframeFilter("ALL");
  };

  // Recenter map on all corridors
  const handleRecenter = () => {
    if (!mapInstanceRef.current || corridors.length === 0) return;
    const allPoints = [];
    corridors.forEach((c) => {
      if (c.coordinates) c.coordinates.forEach((pt) => allPoints.push(pt));
    });
    if (allPoints.length > 0) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(allPoints), {
        padding: [40, 40],
        maxZoom: 8
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Operational Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#CBD5E1] p-4 rounded-md shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#0B3D91] flex items-center justify-center text-white shadow-xs">
            <MapPin className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-[#071F4D] uppercase">
                Railway Corridor & Maintenance Map
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1976D2]/10 text-[#1976D2] border border-[#1976D2]/30 uppercase">
                COA GIS Telemetry
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Geospatial monitoring of track possessions, real-time block statuses, and departmental work spots
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecenter}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#071F4D] text-xs font-bold uppercase tracking-wider rounded-md border border-[#CBD5E1] transition-colors cursor-pointer"
            title="Reset map camera to full network extent"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#1976D2]" />
            <span>Fit Network</span>
          </button>
          <button
            onClick={loadMapData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1976D2] hover:bg-[#1565C0] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Network Operational Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Corridor Status */}
        <div className="bg-white border border-[#CBD5E1] rounded-md p-3 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center justify-between">
            <span>Corridors Monitored</span>
            <Train className="w-4 h-4 text-[#0B3D91]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#071F4D]">{metrics.corridorsCount}</span>
            <span className="text-[11px] text-[#64748B]">Active Divisions</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-medium text-[#475569]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span> {metrics.freeCount} Free
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> {metrics.plannedCount} Planned
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span> {metrics.blockedCount} Blocked
            </span>
          </div>
        </div>

        {/* Metric 2: Visible Maintenance Spots */}
        <div className="bg-white border border-[#CBD5E1] rounded-md p-3 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center justify-between">
            <span>Maintenance Spots</span>
            <MapPin className="w-4 h-4 text-[#1976D2]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1976D2]">{metrics.tasksCount}</span>
            <span className="text-[11px] text-[#64748B]">Filtered / {tasks.length} Total</span>
          </div>
          <div className="mt-2 text-[10px] text-[#64748B]">
            Across TMS, SMMS & TDMS departments
          </div>
        </div>

        {/* Metric 3: Critical Hotspots */}
        <div className="bg-white border border-[#CBD5E1] rounded-md p-3 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center justify-between">
            <span>Critical Hotspots</span>
            <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#DC2626]">{metrics.highPriorityTasks}</span>
            <span className="text-[11px] text-[#64748B]">High Priority</span>
          </div>
          <div className="mt-2 text-[10px] text-[#DC2626] font-medium">
            Requires immediate possession planning
          </div>
        </div>

        {/* Metric 4: Overdue Maintenance */}
        <div className="bg-white border border-[#CBD5E1] rounded-md p-3 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center justify-between">
            <span>Overdue Maintenance</span>
            <Clock className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#D97706]">{metrics.overdueTasks}</span>
            <span className="text-[11px] text-[#64748B]">Overdue Tasks</span>
          </div>
          <div className="mt-2 text-[10px] text-[#B45309] font-medium">
            Exceeding safety maintenance cycle
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#CBD5E1] rounded-md p-3 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#071F4D] mr-1">
              <Filter className="w-3.5 h-3.5 text-[#1976D2]" />
              Filters:
            </span>

            {/* Department Filter Pills */}
            <div className="inline-flex items-center bg-[#F1F5F9] p-0.5 rounded-md border border-[#CBD5E1]">
              {["ALL", "TMS", "SMMS", "TDMS"].map((dept) => {
                const isSelected = deptFilter === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => setDeptFilter(dept)}
                    className={`px-2.5 py-1 text-xs font-bold uppercase rounded transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#071F4D] text-white shadow-xs"
                        : "text-[#475569] hover:text-[#071F4D] hover:bg-white/60"
                    }`}
                  >
                    {dept === "ALL" ? "All Depts" : dept}
                  </button>
                );
              })}
            </div>

            {/* Priority Filter Pills */}
            <div className="inline-flex items-center bg-[#F1F5F9] p-0.5 rounded-md border border-[#CBD5E1]">
              {["ALL", "High", "Medium", "Low"].map((prio) => {
                const isSelected = priorityFilter === prio;
                return (
                  <button
                    key={prio}
                    onClick={() => setPriorityFilter(prio)}
                    className={`px-2.5 py-1 text-xs font-bold uppercase rounded transition-all cursor-pointer ${
                      isSelected
                        ? prio === "High"
                          ? "bg-[#DC2626] text-white shadow-xs"
                          : prio === "Medium"
                          ? "bg-[#F59E0B] text-white shadow-xs"
                          : "bg-[#071F4D] text-white shadow-xs"
                        : "text-[#475569] hover:text-[#071F4D] hover:bg-white/60"
                    }`}
                  >
                    {prio === "ALL" ? "All Priorities" : prio}
                  </button>
                );
              })}
            </div>

            {/* Timeframe / Overdue Filter Pills */}
            <div className="inline-flex items-center bg-[#F1F5F9] p-0.5 rounded-md border border-[#CBD5E1]">
              <button
                onClick={() => setTimeframeFilter("ALL")}
                className={`px-2.5 py-1 text-xs font-bold uppercase rounded transition-all cursor-pointer ${
                  timeframeFilter === "ALL"
                    ? "bg-[#071F4D] text-white shadow-xs"
                    : "text-[#475569] hover:text-[#071F4D]"
                }`}
              >
                All Dates
              </button>
              <button
                onClick={() => setTimeframeFilter("overdue")}
                className={`px-2.5 py-1 text-xs font-bold uppercase rounded transition-all cursor-pointer ${
                  timeframeFilter === "overdue"
                    ? "bg-[#DC2626] text-white shadow-xs"
                    : "text-[#475569] hover:text-[#DC2626]"
                }`}
              >
                Overdue Only
              </button>
              <button
                onClick={() => setTimeframeFilter("week")}
                className={`px-2.5 py-1 text-xs font-bold uppercase rounded transition-all cursor-pointer ${
                  timeframeFilter === "week"
                    ? "bg-[#1976D2] text-white shadow-xs"
                    : "text-[#475569] hover:text-[#1976D2]"
                }`}
              >
                Next 7 Days
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Corridor Selector Dropdown */}
            <select
              value={corridorFilter}
              onChange={(e) => setCorridorFilter(e.target.value)}
              className="bg-white border border-[#CBD5E1] rounded-md px-2.5 py-1 text-xs font-semibold text-[#071F4D] focus:outline-hidden focus:ring-1 focus:ring-[#1976D2]"
            >
              <option value="ALL">All Corridors (C01 - C03)</option>
              {corridors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.name.split("(")[0].trim()}
                </option>
              ))}
            </select>

            {(deptFilter !== "ALL" ||
              priorityFilter !== "ALL" ||
              corridorFilter !== "ALL" ||
              timeframeFilter !== "ALL") && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-[#DC2626] border border-red-200 text-xs font-bold uppercase rounded-md transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Banner Fallback */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-md p-4 text-red-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Telemetry Connection Error</h4>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={loadMapData}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded uppercase cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Map Container */}
      <div className="relative bg-white border border-[#CBD5E1] rounded-md shadow-sm overflow-hidden">
        {/* Leaflet Map DOM Element */}
        <div
          ref={mapContainerRef}
          className="w-full h-[580px] z-10 bg-[#E5E7EB]"
          style={{ minHeight: "540px" }}
        />

        {/* Loading Spinner Overlay */}
        {loading && (
          <div className="absolute inset-0 z-30 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-8 h-8 text-[#0B3D91] animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#071F4D]">
              Loading Corridor Telemetry & GIS Layers...
            </span>
          </div>
        )}

        {/* Floating Collapsible Legend */}
        <div className="absolute bottom-4 left-4 z-20 max-w-xs bg-white/95 backdrop-blur-sm border border-[#CBD5E1] rounded-md shadow-md text-xs overflow-hidden transition-all">
          <div
            onClick={() => setLegendOpen((prev) => !prev)}
            className="px-3 py-2 bg-[#071F4D] text-white flex items-center justify-between cursor-pointer select-none font-bold uppercase tracking-wider text-[11px]"
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-300" />
              <span>Map Legend & Layers</span>
            </div>
            <span className="text-[10px] text-[#CBD5E1]">
              {legendOpen ? "Hide" : "Show"}
            </span>
          </div>

          {legendOpen && (
            <div className="p-3 space-y-2.5 max-h-[300px] overflow-y-auto">
              {/* Corridor Block Statuses */}
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                  Corridor Block Status
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-1.5 rounded-full bg-[#16A34A]"></span>
                    <span className="text-[#071F4D] font-medium">Free (Normal traffic)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-1.5 rounded-full bg-[#F59E0B] border-t border-dashed border-amber-800"></span>
                    <span className="text-[#071F4D] font-medium">Planned Block (Scheduled)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-1.5 rounded-full bg-[#DC2626]"></span>
                    <span className="text-[#071F4D] font-medium">Blocked Now (Active Line Closure)</span>
                  </div>
                </div>
              </div>

              {/* Department Marker Colors */}
              <div className="border-t border-[#E2E8F0] pt-2">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                  Department Markers
                </span>
                <div className="grid grid-cols-1 gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#071F4D] text-white text-[8px] font-bold flex items-center justify-center border border-white">
                      T
                    </span>
                    <span className="text-[#071F4D]">TMS — Track / Engineering</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#1976D2] text-white text-[8px] font-bold flex items-center justify-center border border-white">
                      S
                    </span>
                    <span className="text-[#071F4D]">SMMS — Signalling & Telecom</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#D97706] text-white text-[8px] font-bold flex items-center justify-center border border-white">
                      O
                    </span>
                    <span className="text-[#071F4D]">TDMS — Traction OHE</span>
                  </div>
                </div>
              </div>

              {/* Priority Indicator Rings */}
              <div className="border-t border-[#E2E8F0] pt-2">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                  Priority Indicator Ring
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-[#DC2626] bg-white"></span>
                    <span>High</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-[#F59E0B] bg-white"></span>
                    <span>Med</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-[#64748B] bg-white"></span>
                    <span>Low</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fallback Message if Empty */}
        {!loading && filteredTasks.length === 0 && corridors.length > 0 && (
          <div className="absolute top-4 right-4 z-20 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 rounded-md shadow-xs text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>No tasks match the active filters.</span>
            <button
              onClick={handleResetFilters}
              className="underline font-bold hover:text-amber-800 cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}

        {/* Empty Network Fallback */}
        {!loading && corridors.length === 0 && (
          <div className="absolute inset-0 z-20 bg-[#F5F7FA] flex flex-col items-center justify-center p-6 text-center">
            <Train className="w-12 h-12 text-[#94A3B8] mb-2" />
            <h3 className="font-bold text-base text-[#071F4D]">No Corridors Available</h3>
            <p className="text-xs text-[#64748B] max-w-sm mt-1">
              Could not retrieve railway network geometry from the memory store.
            </p>
            <button
              onClick={loadMapData}
              className="mt-3 px-4 py-2 bg-[#1976D2] text-white text-xs font-bold uppercase rounded-md shadow-xs cursor-pointer"
            >
              Reload Telemetry
            </button>
          </div>
        )}
      </div>

      {/* Selected Task Details Drawer / Card (when clicked or previewed) */}
      {selectedTask && (
        <div className="bg-white border border-[#CBD5E1] rounded-md p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#0B3D91] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {selectedTask.id}
              </span>
              <h3 className="font-bold text-sm text-[#071F4D]">{selectedTask.title}</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                  PRIORITY_STYLES[selectedTask.priority]?.badgeBg || ""
                }`}
              >
                {selectedTask.priority} Priority
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              {selectedTask.workType} • Section: <strong className="text-[#071F4D]">{selectedTask.section}</strong> (Track: {selectedTask.trackId})
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#475569] pt-1">
              <span>Duration: <strong>{selectedTask.durationHours}h</strong></span>
              <span>•</span>
              <span>
                Status:{" "}
                <strong className={selectedTask.overdueDays > 0 ? "text-red-600" : "text-emerald-600"}>
                  {selectedTask.overdueDays > 0 ? `Overdue by ${selectedTask.overdueDays}d` : "On Schedule"}
                </strong>
              </span>
              <span>•</span>
              <span>Speed Restriction: <strong>{selectedTask.speedRestrictionKmH} km/h</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                if (onNavigateToOptimizer) {
                  onNavigateToOptimizer([selectedTask.id]);
                }
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimize This Task</span>
            </button>
            <button
              onClick={() => setSelectedTask(null)}
              className="p-2 text-[#64748B] hover:text-[#071F4D] hover:bg-slate-100 rounded-md cursor-pointer"
              title="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

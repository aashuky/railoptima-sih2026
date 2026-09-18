// RailOptima API Service Layer
// Communicates with Node.js Express backend on localhost:5000 (via Vite proxy or direct)

const API_BASE = "/api";

export async function fetchMaintenanceTasks(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/maintenance${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function fetchBlocks(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/blocks${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function fetchDashboardSummary() {
  const res = await fetch(`${API_BASE}/dashboard/summary`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function optimizeSchedule(taskIds) {
  const res = await fetch(`${API_BASE}/optimize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskIds })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Optimization failed with status ${res.status}`);
  }
  return data;
}

export async function approvePlan(planId) {
  const res = await fetch(`${API_BASE}/plans/${planId}/approve`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Approval failed with status ${res.status}`);
  }
  return data;
}

export async function resetDemoData() {
  const res = await fetch(`${API_BASE}/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Reset failed with status ${res.status}`);
  }
  return data;
}

export async function fetchCorridors() {
  const res = await fetch(`${API_BASE}/corridors`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}


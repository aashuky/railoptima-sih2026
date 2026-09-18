// RailOptima API Service Layer
// Communicates with Node.js Express backend on localhost:5000 (via Vite proxy or direct)

const API_BASE = import.meta.env.VITE_API_URL || "/api";

function authHeaders() {
  const token = localStorage.getItem("railoptima_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeaders(), ...(options.headers || {}) },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const details = Array.isArray(data.details) ? ` ${data.details.join(" ")}` : "";
    throw new Error(`${data.message || `Request failed with status ${res.status}`}${details}`);
  }
  return data;
}

export async function loginUser(email, password) {
  return request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function registerUser(payload) {
  return request("/auth/register", { method: "POST", body: JSON.stringify(payload) });
}

export async function fetchCurrentUser(token) {
  return request("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
}

export async function explainPlan(plan) {
  const token = localStorage.getItem("railoptima_token");
  return request("/ai/explain", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify({ plan })
  });
}

export async function fetchMaintenanceTasks(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/maintenance${query ? `?${query}` : ""}`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function fetchBlocks(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/blocks${query ? `?${query}` : ""}`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function fetchDashboardSummary() {
  const res = await fetch(`${API_BASE}/dashboard/summary`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function optimizeSchedule(taskIds) {
  const res = await fetch(`${API_BASE}/optimize`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
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
    headers: { "Content-Type": "application/json", ...authHeaders() }
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
    headers: { "Content-Type": "application/json", ...authHeaders() }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Reset failed with status ${res.status}`);
  }
  return data;
}

export async function fetchCorridors() {
  const res = await fetch(`${API_BASE}/corridors`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

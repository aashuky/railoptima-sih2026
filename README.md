# RailOptima 🚆⚡

### AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways
**Smart India Hackathon 2026 | Problem Statement ID: 26027 | Category: Software (Transportation & Logistics)**  
**Organization:** Ministry of Railways, Government of India  
**Gateway Integration:** Centre for Railway Information Systems (CRIS) / Control Office Application (COA) & BDMS

---

## 1. Executive Summary & Problem Context

In Indian Railways, fixed infrastructure maintenance has traditionally been planned in functional silos:
- **TMS (Track Management System)**: Civil engineering, rails, turnouts, sleepers, ballast.
- **SMMS (Signalling Maintenance & Management System)**: Interlocking, point machines, signals, axle counters.
- **TDMS (Traction Distribution Management System)**: 25 kV AC overhead catenary (OHE), cantilevers, power feeding.

Each department independently booked separate maintenance blocks/disconnections in the legacy BDMS. This decentralized, manual process caused:
- **Redundant Train Disruptions**: Separate block requests for the same section resulting in multiple distinct train stoppages and timetable delays.
- **Asset Downtime**: Fixed rail assets closed repeatedly rather than concurrently under safe joint possessions.
- **Coordination Friction**: Lack of unified cross-department visibility across Engineering, S&T, and Electrical divisions.

**RailOptima** solves this by unifying maintenance intake into a single coordinated pipeline, executing rule-based explainable compatibility scoring, detecting operational conflicts, and greedily packing multi-department tasks into the fewest available COA block windows.

---

## 2. Technical Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js (REST API running on `http://localhost:5000`)
- **Data Layer**: In-memory simulated dataset with instantaneous repeatable reset (`POST /api/reset`)
- **Visual Identity**: Rooted in Indian Railways Control Office operational standards and signaling color scheme:
  - **Signal Red (`#ED1B24`)**: High priority tasks, critical signals, primary optimization CTA
  - **Deep Red (`#B52229`)**: Critical hover states, possession highlights
  - **Charcoal (`#312F30`)**: Operational panels and tabular consoles
  - **Near-black (`#111111`)**: Deep navigation headers and control strips
  - **Light Gray (`#F2F2F2`)**: Dense data workspace background
  - **Mid Gray (`#CCCCCC`)**: Crisp operational borders and dividers
  - **Gray (`#999999`)**: Secondary operational metadata and timestamps

---

## 3. Core Scheduling Engine & Explainable AI

RailOptima deliberately uses **transparent, explainable rule-based algorithms** rather than opaque black-box machine learning models:

### A. Compatibility Checker (0 - 100 Score, Factors Sum Exactly to 100)
1. **Corridor Alignment (23 pts)**: Tasks MUST share the exact corridor segment. Mismatched corridors result in an immediate score of `0` and a critical conflict.
2. **Window Capacity Fit (23 pts)**: Total combined task duration must fit within the block window duration (e.g. 4.0h work within 4.0h window = full 23 pts).
3. **Cross-Department Synergy (30 pts)**:
   - 3 departments (TMS + SMMS + TDMS): 30 pts (maximum bonus for eliminating multiple line stoppages).
   - 2 departments: 20 pts
   - 1 department: 8 pts
4. **Safety Feasibility & Clearances (12 pts)**: Verifies that de-energized OHE catenary power blocks allow safe concurrent track machine and signal interlocking work.
5. **Urgency & Priority Weight (12 pts)**: Prioritizes critical High-Priority path items (>=2 High: 12 pts, 1 High: 9 pts, Med/Low: 6 pts).
*(Total: 23 + 23 + 30 + 12 + 12 = 100 pts)*

### B. Conflict Detector
- **Spatial / Corridor Mismatch**: Flags if tasks span across disconnected rail routes.
- **Temporal Duration Overflow**: Flags if combined task hours exceed the maximum COA block window margin.
- **High Track Density**: Alerts planners if excessive concurrent work groups crowd the same track section.

### C. Greedy Block Packing & Plain-Language Explainer
- Sorts tasks by priority and duration.
- Greedily packs compatible tasks into the matching corridor's earliest available COA block.
- Automatically generates human-readable explanations explaining *why* tasks were grouped together, how many line closures were eliminated, and details regarding any unassigned or cross-corridor tasks.

---

## 4. REST API Reference (`http://localhost:5000/api`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/maintenance` | Returns all maintenance requests (supports `?department=`, `?status=`, `?corridor=`) |
| `GET` | `/api/blocks` | Returns available and scheduled block windows (supports `?corridor=`, `?status=`) |
| `GET` | `/api/dashboard/summary` | Returns total, pending, and scheduled tasks, planned blocks, and department breakdowns |
| `POST` | `/api/optimize` | Body: `{ taskIds: ["T001", "T002", "T003"] }`. Runs compatibility and greedy scheduling engine. Returns plan with assigned tasks, score breakdown, plain-language explanation, and simulated comparison |
| `PUT` | `/api/plans/:planId/approve` | Approves the generated plan, marks tasks as `Scheduled`, updates block status to `Scheduled` |
| `POST` | `/api/reset` | Resets in-memory data back to initial September 2026 seed state for repeatable demo rehearsals |

---

## 5. Seed Dataset (September 2026 - Simulated Prototype Data)

- **Task T001**: TMS (Track), "Track Repair", Corridor C01 (Simulated Section Alpha–Beta), 2h, High Priority, Pending
- **Task T002**: SMMS (Signalling), "Signal Box Inspection", Corridor C01 (Simulated Section Alpha–Beta), 1h, High Priority, Pending
- **Task T003**: TDMS (Traction), "OHE Maintenance", Corridor C01 (Simulated Section Alpha–Beta), 1h, Medium Priority, Pending
- **Block BLK-C01-01**: Corridor C01, Section: Junction Alpha – Junction Beta (Simulated), Date: 2026-09-18, Window: 01:00 - 05:00 (4-hour nocturnal slot), Status: Available

---

## 6. How to Run the Project

### Prerequisites
- Node.js (v18 or higher) and npm

### Option A: Running with Root Concurrent Script
```bash
# From project root (C:\Users\HP\Desktop\railoptima)
npm install
npm run dev
```

### Option B: Running Server and Client Separately

**Terminal 1 (Backend REST API):**
```bash
cd server
npm install
npm start
# Runs on http://localhost:5000
```

**Terminal 2 (Frontend UI):**
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 7. Rehearsal & Demonstration Flow (For Judges)

1. **Open Dashboard (`http://localhost:5173`)**:
   - Inspect the live operations banner, summary stat counters, department breakdown (TMS / SMMS / TDMS), and the maintenance requests queue.
   - Note that Tasks `T001`, `T002`, and `T003` are initially in `Pending` status.
2. **Navigate to AI Block Optimizer**:
   - Observe the pending intake queue. Click "Select Seed Demo (T001, T002, T003)".
   - Click **"Generate Optimized Plan"**.
   - Review the **Compatibility Score (100/100)** with factor breakdown.
   - Read the transparent **Plain-Language Justification**.
   - Examine the **Simulated Scenario Comparison**:
     - *Before (Manual)*: 3 separate blocks / 3 line closures / 4h disjointed track stoppage.
     - *After (AI Coordinated)*: 1 unified block (`BLK-C01-01`) / 1 single train disruption / 67% reduction in disruption instances.
3. **Approve the Plan**:
   - Click **"Approve & Schedule Plan"**.
   - Notice the instant confirmation notification and transition of tasks to `Scheduled`.
4. **Inspect Block Plans (Dual Horizon)**:
   - Switch between **Weekly Horizon** (Week 3 of Sept 2026) and **Monthly Horizon**.
   - Verify that Block `BLK-C01-01` now shows `Approved` with all three department tags (`TMS`, `SMMS`, `TDMS`) and bundled tasks (`T001`, `T002`, `T003`).
5. **Reset Demo Data**:
   - Click the **"Reset Demo Data"** button in the top navigation bar at any time to instantly restore the original demo state for the next rehearsal or presentation!

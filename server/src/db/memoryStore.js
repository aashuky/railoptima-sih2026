// RailOptima Seed Data - Indian Railways Control Office Application (COA / BDMS)
// Context: September 2026 (Clearly Labeled Simulated Operational Dataset)

const INITIAL_CORRIDORS = [
  {
    id: "C01",
    name: "Corridor C01 (Simulated Section Alpha–Beta)",
    zone: "Simulated Northern Zone",
    division: "Simulated Division 1",
    electrification: "25 kV AC Overhead Catenary",
    lineType: "Double Line High-Density Route (Simulated)",
    maxSpeedKmH: 160,
    blockStatus: "Planned Block",
    coordinates: [
      [28.6139, 77.2090],
      [28.6692, 77.4538],
      [27.8974, 78.0880]
    ],
    stations: [
      { name: "Junction Alpha", code: "JNA", coordinates: [28.6139, 77.2090] },
      { name: "Alpha Mid (Ghaziabad)", code: "AMS", coordinates: [28.6692, 77.4538] },
      { name: "Junction Beta (Aligarh)", code: "JNB", coordinates: [27.8974, 78.0880] }
    ]
  },
  {
    id: "C02",
    name: "Corridor C02 (Simulated Section Gamma–Delta)",
    zone: "Simulated Central Zone",
    division: "Simulated Division 2",
    electrification: "25 kV AC Overhead Catenary",
    lineType: "Dedicated Freight / Quad Line (Simulated)",
    maxSpeedKmH: 130,
    blockStatus: "Blocked Now",
    coordinates: [
      [21.1458, 79.0882],
      [20.8900, 78.7800],
      [20.7380, 78.5900]
    ],
    stations: [
      { name: "Junction Gamma (Nagpur)", code: "JNG", coordinates: [21.1458, 79.0882] },
      { name: "Gamma Mid (Sewagram)", code: "GMS", coordinates: [20.8900, 78.7800] },
      { name: "Junction Delta (Wardha)", code: "JND", coordinates: [20.7380, 78.5900] }
    ]
  },
  {
    id: "C03",
    name: "Corridor C03 (Simulated Section Epsilon–Zeta)",
    zone: "Simulated Western Zone",
    division: "Simulated Division 3",
    electrification: "25 kV AC Overhead Catenary",
    lineType: "Double Line Fast Corridor (Simulated)",
    maxSpeedKmH: 140,
    blockStatus: "Free",
    coordinates: [
      [22.3072, 73.1812],
      [21.7051, 72.9959],
      [21.1702, 72.8311]
    ],
    stations: [
      { name: "Junction Epsilon (Vadodara)", code: "JNE", coordinates: [22.3072, 73.1812] },
      { name: "Epsilon Mid (Bharuch)", code: "EMS", coordinates: [21.7051, 72.9959] },
      { name: "Junction Zeta (Surat)", code: "JNZ", coordinates: [21.1702, 72.8311] }
    ]
  }
];

// Seed simulated maintenance requests across 3 departments:
// TMS: Track Management System (Engineering)
// SMMS: Signalling Maintenance & Management System (Signal & Telecom)
// TDMS: Traction Distribution Management System (Electrical / OHE)
const INITIAL_TASKS = [
  {
    id: "T001",
    department: "TMS",
    departmentName: "Track Management System (Engineering)",
    title: "Track Repair",
    workType: "Ultrasonic Flaw Grinding & Rail Weld Rectification",
    corridor: "C01",
    corridorName: "Corridor C01 (Simulated Section Alpha–Beta)",
    section: "Junction Alpha – Junction Beta (Simulated KM 101/2 - 103/0)",
    trackId: "UP-MAIN-104",
    durationHours: 2,
    priority: "High",
    status: "Pending",
    requestedDate: "2026-09-18",
    equipmentRequired: ["Rail Grinding Machine (RGM)", "Weld Flash-Butt Rig"],
    speedRestrictionKmH: 30,
    safetyNotes: "Requires traffic disconnection on UP Main track.",
    coordinates: [28.6415, 77.3314],
    overdueDays: 2
  },
  {
    id: "T002",
    department: "SMMS",
    departmentName: "Signalling Maintenance & Management System",
    title: "Signal Box Inspection",
    workType: "Electronic Interlocking (EI) Diagnostic & Point Machine Overhaul",
    corridor: "C01",
    corridorName: "Corridor C01 (Simulated Section Alpha–Beta)",
    section: "Junction Alpha Yard (Simulated KM 101/8 - 102/4)",
    trackId: "UP-MAIN-104",
    durationHours: 1,
    priority: "High",
    status: "Pending",
    requestedDate: "2026-09-18",
    equipmentRequired: ["Relay Diagnostic Analyzer", "Point Drive Gauge"],
    speedRestrictionKmH: 0,
    safetyNotes: "Requires signal disconnection; fail-safe clamp on point switch 42A.",
    coordinates: [28.6250, 77.2500],
    overdueDays: 4
  },
  {
    id: "T003",
    department: "TDMS",
    departmentName: "Traction Distribution Management System",
    title: "OHE Maintenance",
    workType: "Catenary Wire Sag Adjustment & Insulator Cleaning",
    corridor: "C01",
    corridorName: "Corridor C01 (Simulated Section Alpha–Beta)",
    section: "Junction Alpha – Junction Beta (Simulated KM 101/0 - 103/5)",
    trackId: "UP-MAIN-104",
    durationHours: 1,
    priority: "Medium",
    status: "Pending",
    requestedDate: "2026-09-18",
    equipmentRequired: ["Tower Wagon OHE", "Discharge Rod Earth Rigs"],
    speedRestrictionKmH: 0,
    safetyNotes: "Requires 25kV power block and track possession for tower wagon.",
    coordinates: [28.6550, 77.3800],
    overdueDays: 0
  },
  {
    id: "T004",
    department: "TMS",
    departmentName: "Track Management System (Engineering)",
    title: "Turnout Replacement",
    workType: "1 in 12 Cast Manganese Steel (CMS) Crossing Overhaul",
    corridor: "C02",
    corridorName: "Corridor C02 (Simulated Section Gamma–Delta)",
    section: "Junction Gamma North Yard (Simulated KM 201/0 - 202/2)",
    trackId: "DN-MAIN-201",
    durationHours: 3,
    priority: "High",
    status: "Pending",
    requestedDate: "2026-09-19",
    equipmentRequired: ["Track Tamping Machine (CSM)", "Crane Rig"],
    speedRestrictionKmH: 20,
    safetyNotes: "Complete traffic block needed on DN mainline.",
    coordinates: [21.1200, 79.0400],
    overdueDays: 3
  },
  {
    id: "T005",
    department: "SMMS",
    departmentName: "Signalling Maintenance & Management System",
    title: "Axle Counter Calibration",
    workType: "Digital Axle Counter (MSDAC) Sensor Tuning",
    corridor: "C02",
    corridorName: "Corridor C02 (Simulated Section Gamma–Delta)",
    section: "Junction Gamma – Junction Delta (Simulated KM 201/5 - 203/0)",
    trackId: "DN-MAIN-201",
    durationHours: 2,
    priority: "Medium",
    status: "Pending",
    requestedDate: "2026-09-19",
    equipmentRequired: ["High-Frequency Signal Meter", "Track Coupler Clamp"],
    speedRestrictionKmH: 0,
    safetyNotes: "Requires track possession alongside TMS track work.",
    coordinates: [20.9500, 78.8500],
    overdueDays: 1
  },
  {
    id: "T006",
    department: "TDMS",
    departmentName: "Traction Distribution Management System",
    title: "Cantilever Replacement",
    workType: "OHE Mast Cantilever Bracket & Dropper Renewal",
    corridor: "C01",
    corridorName: "Corridor C01 (Simulated Section Alpha–Beta)",
    section: "Junction Alpha Outer (Simulated KM 105/0 - 107/0)",
    trackId: "UP-MAIN-104",
    durationHours: 3,
    priority: "Low",
    status: "Pending",
    requestedDate: "2026-09-22",
    equipmentRequired: ["OHE Ladder Trolley", "Earthing Spikes"],
    speedRestrictionKmH: 0,
    safetyNotes: "Power block required.",
    coordinates: [28.3200, 77.7500],
    overdueDays: 0
  },
  {
    id: "T007",
    department: "TMS",
    departmentName: "Track Management System (Engineering)",
    title: "Sleeper Renewal",
    workType: "Heavy PSC Sleeper Replacement & Deep Screening",
    corridor: "C03",
    corridorName: "Corridor C03 (Simulated Section Epsilon–Zeta)",
    section: "Junction Epsilon – Junction Zeta (Simulated KM 301/4 - 303/0)",
    trackId: "UP-LOOP-302",
    durationHours: 4,
    priority: "High",
    status: "Pending",
    requestedDate: "2026-09-25",
    equipmentRequired: ["Ballast Cleaning Machine (BCM)", "Unimat Tamper"],
    speedRestrictionKmH: 15,
    safetyNotes: "4-hour continuous window required.",
    coordinates: [21.8500, 73.0500],
    overdueDays: 5
  }
];

// Available and scheduled maintenance block windows managed by Control Office Application (COA)
const INITIAL_BLOCKS = [
  {
    id: "BLK-C01-01",
    corridor: "C01",
    corridorName: "Corridor C01 (Simulated Section Alpha–Beta)",
    section: "Junction Alpha – Junction Beta (Simulated)",
    date: "2026-09-18",
    startTime: "2026-09-18T01:00:00.000Z",
    endTime: "2026-09-18T05:00:00.000Z",
    durationHours: 4,
    status: "Available",
    allowedDepartments: ["TMS", "SMMS", "TDMS"],
    trafficImpact: "Low (Simulated Freight Window)",
    description: "Scheduled nocturnal maintenance window during passenger lulls.",
    assignedTasks: [],
    departments: []
  },
  {
    id: "BLK-C01-02",
    corridor: "C01",
    corridorName: "Corridor C01 (Simulated Section Alpha–Beta)",
    section: "Junction Alpha Outer (Simulated)",
    date: "2026-09-22",
    startTime: "2026-09-22T02:00:00.000Z",
    endTime: "2026-09-22T06:00:00.000Z",
    durationHours: 4,
    status: "Available",
    allowedDepartments: ["TMS", "SMMS", "TDMS"],
    trafficImpact: "Low (Simulated Night Window)",
    description: "Early morning freight regulation slot for maintenance.",
    assignedTasks: [],
    departments: []
  },
  {
    id: "BLK-C02-01",
    corridor: "C02",
    corridorName: "Corridor C02 (Simulated Section Gamma–Delta)",
    section: "Junction Gamma – Junction Delta (Simulated)",
    date: "2026-09-19",
    startTime: "2026-09-19T00:30:00.000Z",
    endTime: "2026-09-19T04:30:00.000Z",
    durationHours: 4,
    status: "Available",
    allowedDepartments: ["TMS", "SMMS", "TDMS"],
    trafficImpact: "Moderate (Simulated Freight Diversion)",
    description: "Multi-department slot coordinated with freight control.",
    assignedTasks: [],
    departments: []
  },
  {
    id: "BLK-C03-01",
    corridor: "C03",
    corridorName: "Corridor C03 (Simulated Section Epsilon–Zeta)",
    section: "Junction Epsilon – Junction Zeta (Simulated)",
    date: "2026-09-25",
    startTime: "2026-09-25T01:00:00.000Z",
    endTime: "2026-09-25T05:00:00.000Z",
    durationHours: 4,
    status: "Available",
    allowedDepartments: ["TMS", "SMMS", "TDMS"],
    trafficImpact: "Low (Simulated Express Corridor)",
    description: "Scheduled loop and mainline track renewal slot.",
    assignedTasks: [],
    departments: []
  },
  // Pre-scheduled historical/planned blocks across September 2026 for rich Monthly & Weekly view:
  {
    id: "BLK-C01-03",
    corridor: "C01",
    corridorName: "Corridor C01 (Simulated Section Alpha–Beta)",
    section: "Junction Alpha North (Simulated)",
    date: "2026-09-08",
    startTime: "2026-09-08T01:30:00.000Z",
    endTime: "2026-09-08T04:30:00.000Z",
    durationHours: 3,
    status: "Scheduled",
    allowedDepartments: ["TMS", "TDMS"],
    trafficImpact: "Low",
    description: "Executed joint track tamp and catenary inspection.",
    assignedTasks: ["T-ARCH-01", "T-ARCH-02"],
    departments: ["TMS", "TDMS"]
  },
  {
    id: "BLK-C02-02",
    corridor: "C02",
    corridorName: "Corridor C02 (Simulated Section Gamma–Delta)",
    section: "Junction Gamma Loop (Simulated)",
    date: "2026-09-12",
    startTime: "2026-09-12T02:00:00.000Z",
    endTime: "2026-09-12T05:00:00.000Z",
    durationHours: 3,
    status: "Scheduled",
    allowedDepartments: ["SMMS"],
    trafficImpact: "Low",
    description: "Point machine testing completed.",
    assignedTasks: ["T-ARCH-03"],
    departments: ["SMMS"]
  },
  {
    id: "BLK-C01-04",
    corridor: "C01",
    corridorName: "Corridor C01 (Simulated Section Alpha–Beta)",
    section: "Junction Beta Yard (Simulated)",
    date: "2026-09-28",
    startTime: "2026-09-28T01:00:00.000Z",
    endTime: "2026-09-28T04:00:00.000Z",
    durationHours: 3,
    status: "Scheduled",
    allowedDepartments: ["TMS", "SMMS"],
    trafficImpact: "Low",
    description: "Planned joint turnout maintenance & signal relay test.",
    assignedTasks: ["T-ARCH-04", "T-ARCH-05"],
    departments: ["TMS", "SMMS"]
  }
];

// In-memory working copies
let tasks = JSON.parse(JSON.stringify(INITIAL_TASKS));
let blocks = JSON.parse(JSON.stringify(INITIAL_BLOCKS));
let corridors = JSON.parse(JSON.stringify(INITIAL_CORRIDORS));
let plans = [];

module.exports = {
  getTasks: () => tasks,
  getBlocks: () => blocks,
  getCorridors: () => corridors,
  getPlans: () => plans,
  findTaskById: (id) => tasks.find((t) => t.id === id),
  findBlockById: (id) => blocks.find((b) => b.id === id),
  findPlanById: (id) => plans.find((p) => p.planId === id),
  savePlan: (plan) => {
    const existingIndex = plans.findIndex((p) => p.planId === plan.planId);
    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.push(plan);
    }
    return plan;
  },
  updateTask: (id, updates) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      Object.assign(task, updates);
      return task;
    }
    return null;
  },
  updateBlock: (id, updates) => {
    const block = blocks.find((b) => b.id === id);
    if (block) {
      Object.assign(block, updates);
      return block;
    }
    return null;
  },
  resetData: () => {
    tasks = JSON.parse(JSON.stringify(INITIAL_TASKS));
    blocks = JSON.parse(JSON.stringify(INITIAL_BLOCKS));
    corridors = JSON.parse(JSON.stringify(INITIAL_CORRIDORS));
    plans = [];
    return {
      message: "RailOptima database reset to initial September 2026 simulated seed state successfully.",
      taskCount: tasks.length,
      blockCount: blocks.length
    };
  }
};

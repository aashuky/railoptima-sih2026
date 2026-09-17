// End-to-End REST API Verification Suite for RailOptima
const http = require("http");

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on("error", reject);
    if (data) {
      req.write(typeof data === "string" ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log(" RUNNING RAILOPTIMA E2E REST API VERIFICATION");
  console.log("==================================================");

  // 1. Health check
  console.log("\n1. Testing GET / (Root Health Check)");
  const health = await request({ hostname: "localhost", port: 5000, path: "/", method: "GET" });
  console.log("Status:", health.status, "System:", health.data.system);
  if (health.status !== 200) throw new Error("Health check failed");

  // 2. GET /api/maintenance
  console.log("\n2. Testing GET /api/maintenance");
  const maint = await request({ hostname: "localhost", port: 5000, path: "/api/maintenance", method: "GET" });
  console.log("Status:", maint.status, "Tasks count:", maint.data.count);
  const t1 = maint.data.tasks.find((t) => t.id === "T001");
  const t2 = maint.data.tasks.find((t) => t.id === "T002");
  const t3 = maint.data.tasks.find((t) => t.id === "T003");
  if (!t1 || !t2 || !t3) throw new Error("Seed tasks T001, T002, T003 missing");
  console.log("Found seed tasks: T001 (TMS), T002 (SMMS), T003 (TDMS)");

  // 3. GET /api/blocks
  console.log("\n3. Testing GET /api/blocks");
  const blocks = await request({ hostname: "localhost", port: 5000, path: "/api/blocks", method: "GET" });
  console.log("Status:", blocks.status, "Blocks count:", blocks.data.count);
  const b1 = blocks.data.blocks.find((b) => b.id === "BLK-C01-01");
  if (!b1) throw new Error("Block BLK-C01-01 missing");
  console.log("Found seed block BLK-C01-01 on Corridor C01");

  // 4. GET /api/dashboard/summary
  console.log("\n4. Testing GET /api/dashboard/summary");
  const summary = await request({ hostname: "localhost", port: 5000, path: "/api/dashboard/summary", method: "GET" });
  console.log("Status:", summary.status);
  console.log("Summary metrics:", summary.data.summary);
  if (summary.data.summary.pendingRequests < 3) throw new Error("Expected at least 3 pending requests");

  // 5. POST /api/optimize
  console.log("\n5. Testing POST /api/optimize with { taskIds: ['T001', 'T002', 'T003'] }");
  const optRes = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/optimize",
      method: "POST",
      headers: { "Content-Type": "application/json" }
    },
    { taskIds: ["T001", "T002", "T003"] }
  );
  console.log("Status:", optRes.status);
  const plan = optRes.data;
  console.log("Assigned Tasks:", plan.assignedTasks.map((t) => t.id));
  console.log("Block ID:", plan.blockId);
  console.log("Corridor:", plan.corridor);
  console.log("Compatibility Score:", plan.compatibilityScore);
  console.log("Explanation:", plan.explanation);
  console.log("Simulated Comparison:", plan.simulatedComparison);
  if (plan.assignedTasks.length !== 3 || plan.blockId !== "BLK-C01-01") {
    throw new Error("Optimization plan failed to bundle T001, T002, T003 into BLK-C01-01");
  }

  // 6. PUT /api/plans/:planId/approve
  console.log(`\n6. Testing PUT /api/plans/${plan.planId}/approve`);
  const approveRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/plans/${plan.planId}/approve`,
    method: "PUT"
  });
  console.log("Status:", approveRes.status);
  console.log("Message:", approveRes.data.message);
  if (approveRes.status !== 200) throw new Error("Approval failed");

  // Verify updated summary
  console.log("\n7. Verifying summary after approval");
  const updatedSummary = await request({ hostname: "localhost", port: 5000, path: "/api/dashboard/summary", method: "GET" });
  console.log("Updated Scheduled Requests:", updatedSummary.data.summary.scheduledRequests);
  if (updatedSummary.data.summary.scheduledRequests < 3) {
    throw new Error("Tasks were not marked as Scheduled in summary");
  }

  // 8. POST /api/reset
  console.log("\n8. Testing POST /api/reset (Demo Rehearsal Reset)");
  const resetRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/reset",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  console.log("Status:", resetRes.status, "Reset Message:", resetRes.data.message);

  // Verify seed restoration
  const postResetMaint = await request({ hostname: "localhost", port: 5000, path: "/api/maintenance", method: "GET" });
  const restoredT1 = postResetMaint.data.tasks.find((t) => t.id === "T001");
  console.log("Restored T001 status:", restoredT1.status);
  if (restoredT1.status !== "Pending") throw new Error("T001 was not restored to Pending");

  console.log("\n==================================================");
  console.log(" ALL 8 E2E REST API TESTS PASSED SUCCESSFULLY! ");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("TEST SUITE FAILED:", err);
  process.exit(1);
});

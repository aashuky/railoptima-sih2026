const express = require("express");
const cors = require("cors");

const config = require("./config");

const applySecurity = require("./middleware/security");
const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const apiRoutes = require("./routes");

const app = express();

applySecurity(app);
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({
    system: "RailOptima - AI-Powered Automatic Block Planning",
    organization: "Indian Railways | Centre for Railway Information Systems (CRIS)",
    status: "Operational",
    environment: config.env,
    timestamp: new Date().toISOString()
  });
});

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

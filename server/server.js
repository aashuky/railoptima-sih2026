const app = require("./src/app");
const config = require("./src/config");
const logger = require("./src/utils/logger");

const server = app.listen(config.port, () => {
  logger.info(`RailOptima API running on port ${config.port} [${config.env}]`);
  logger.info(`Base URL: http://localhost:${config.port}/api`);
});

// Previously missing entirely: an unhandled promise rejection or thrown error
// outside Express (e.g. in a timer, or an await without try/catch) would crash
// the process with no log line explaining why.
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection - shutting down", { reason: reason && reason.message ? reason.message : reason });
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception - shutting down", { message: err.message, stack: err.stack });
  process.exit(1);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Closing server gracefully.");
  server.close(() => process.exit(0));
});

module.exports = server;
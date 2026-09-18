const app = require("./src/app");
const config = require("./src/config");
const logger = require("./src/utils/logger");
const connectDB = require("./src/config/db");

const startServer = async () => {
  await connectDB();
  const server = app.listen(config.port, () => {
    logger.info(`RailOptima API running on port ${config.port} [${config.env}]`);
    logger.info(`Base URL: http://localhost:${config.port}/api`);
  });

  return server;
};

const serverPromise = startServer();

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection - shutting down", { reason: reason && reason.message ? reason.message : reason });
  serverPromise.then((server) => server.close(() => process.exit(1))).catch(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception - shutting down", { message: err.message, stack: err.stack });
  process.exit(1);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Closing server gracefully.");
  serverPromise.then((server) => server.close(() => process.exit(0))).catch(() => process.exit(0));
});

module.exports = serverPromise;
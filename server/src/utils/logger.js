const LEVELS = { info: "INFO", warn: "WARN", error: "ERROR" };

function log(level, message, meta) {
  const line = `[${new Date().toISOString()}] [${LEVELS[level]}] ${message}`;
  const out = level === "error" ? console.error : console.log;
  if (meta) out(line, meta);
  else out(line);
}

module.exports = {
  info: (msg, meta) => log("info", msg, meta),
  warn: (msg, meta) => log("warn", msg, meta),
  error: (msg, meta) => log("error", msg, meta)
};

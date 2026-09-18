const { DEPARTMENTS } = require("../config/constants");
const { ROLES } = require("../models/User");

function validateRegister(body) {
  const errors = [];
  if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
    errors.push("name is required (min 2 characters)");
  }
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("a valid email is required");
  }
  if (!body.password || typeof body.password !== "string" || body.password.length < 6) {
    errors.push("password is required (min 6 characters)");
  }
  if (body.role && !ROLES.includes(body.role)) {
    errors.push(`role must be one of: ${ROLES.join(", ")}`);
  }
  if (body.department && !DEPARTMENTS[body.department]) {
    errors.push(`department must be one of: ${Object.keys(DEPARTMENTS).join(", ")}`);
  }
  if ((body.role || "engineer") === "engineer" && !body.department) {
    errors.push("department is required for role 'engineer'");
  }
  return errors;
}

function validateLogin(body) {
  const errors = [];
  if (!body.email) errors.push("email is required");
  if (!body.password) errors.push("password is required");
  return errors;
}

module.exports = { validateRegister, validateLogin };

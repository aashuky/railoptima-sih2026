// Central place for enums/magic strings so services & models never hardcode them.

const DEPARTMENTS = { TMS: "TMS", SMMS: "SMMS", TDMS: "TDMS" };

const DEPARTMENT_NAMES = {
  TMS: "Track Management System (Engineering)",
  SMMS: "Signalling Maintenance & Management System",
  TDMS: "Traction Distribution Management System"
};

const PRIORITIES = ["High", "Medium", "Low"];
const PRIORITY_WEIGHT = { High: 3, Medium: 2, Low: 1 };

const TASK_STATUS = ["Pending", "Scheduled", "Cancelled"];
const BLOCK_STATUS = ["Available", "Scheduled", "Closed"];

module.exports = {
  DEPARTMENTS,
  DEPARTMENT_NAMES,
  PRIORITIES,
  PRIORITY_WEIGHT,
  TASK_STATUS,
  BLOCK_STATUS
};

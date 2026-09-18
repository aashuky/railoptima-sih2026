// Swap point: replace this require with e.g. "./mongoStore" once a real database
// is wired up. Every consumer of `db` (controllers/services) only relies on the
// interface exported by memoryStore.js, so nothing else has to change.
module.exports = require("./memoryStore");

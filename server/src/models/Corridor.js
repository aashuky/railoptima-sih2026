/** 
 * @typedef {Object} Corridor
 * @property {string} id
 * @property {string} name
 * @property {string} zone
 * @property {string} division
 * @property {string} electrification
 * @property {string} lineType
 * @property {number} maxSpeedKmH
 **/

// Corridors are reference/lookup data seeded once; no mutation path exists yet,
// so only a shape doc is kept here (extend with validateCorridor if a create/edit
// endpoint is added later).
module.exports = {};

// Every controller in the original code repeated the same try/catch block.
// Wrapping handlers here means a thrown/rejected error always reaches errorHandler.js.
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

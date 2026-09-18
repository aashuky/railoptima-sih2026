function success(res, statusCode, payload = {}) {
  return res.status(statusCode).json({ success: true, ...payload });
}

function failure(res, statusCode, message, extra = {}) {
  return res.status(statusCode).json({ success: false, message, ...extra });
}

module.exports = { success, failure };

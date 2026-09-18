const jwt = require("jsonwebtoken");
const config = require("../config");

function signToken(user) {
  return jwt.sign({ id: user._id || user.id, role: user.role, department: user.department }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
}

function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

module.exports = { signToken, verifyToken };

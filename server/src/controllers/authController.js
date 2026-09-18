const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const { success } = require("../utils/response");
const { signToken } = require("../services/jwt");
const { validateRegister, validateLogin } = require("../validators/authValidator");

const register = asyncHandler(async (req, res) => {
  const errors = validateRegister(req.body || {});
  if (errors.length > 0) throw new ApiError(400, "Invalid registration data", errors);

  const { name, email, password, role, department } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, "An account with this email already exists.");

  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role: role || "engineer",
    department: role === "engineer" || !role ? department : null
  });

  const token = signToken(user);
  return success(res, 201, { token, user: user.toSafeObject() });
});

const login = asyncHandler(async (req, res) => {
  const errors = validateLogin(req.body || {});
  if (errors.length > 0) throw new ApiError(400, "Invalid login data", errors);

  const { email, password } = req.body;

  // password field has `select: false` in the schema - must opt back in explicitly.
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password.");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password.");

  const token = signToken(user);
  return success(res, 200, { token, user: user.toSafeObject() });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, "User not found.");
  return success(res, 200, { user: user.toSafeObject() });
});

module.exports = { register, login, me };

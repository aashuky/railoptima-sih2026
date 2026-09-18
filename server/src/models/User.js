const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { DEPARTMENTS } = require("../config/constants");

const ROLES = ["engineer", "controller", "admin"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ROLES,
      default: "engineer",
    },

    department: {
      type: String,
      enum: [...Object.keys(DEPARTMENTS), null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ===============================
// HASH PASSWORD BEFORE SAVE
// ===============================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ===============================
// COMPARE PASSWORD
// ===============================
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// ===============================
// SAFE USER OBJECT
// ===============================
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    department: this.department,
  };
};

module.exports = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;

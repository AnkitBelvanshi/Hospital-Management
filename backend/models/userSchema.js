import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please Provide A Valid Email!"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
  },
  nic: {
    type: String,
    required: true,
    minLength: [5, "NIC Must Contain Exact 5 Digits!"],
    maxLength: [5, "NIC Must Contain Exact 5 Digits!"],
  },
  dob: {
    type: Date,
    required: [true, "DOB is required!"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  password: {
    type: String,
    minLength: [8, "Password must contain at least 8 Characters!"],
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["Admin", "Patient", "Doctor"],
  },
  doctorDepartment: {
    type: String,
    required: function () {
      return this.role === "Doctor";
    },
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
  priorityStatus: {
    type: String,
    enum: ["Normal", "Urgent", "Critical"],
    default: "Normal",
    required: function () {
      return this.role === "Patient";
    },
  },
  admitted: {
    type: Boolean,
    default: false,
    required: function () {
      return this.role === "Patient";
    },
  },
  bedNumber: {
    type: String,
    default: null,
    required: function () {
      return this.role === "Patient" && this.admitted === true;
    },
  },
});

// ✅ Hash password & clean up irrelevant fields
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Remove unrelated fields based on role
  if (this.role !== "Doctor") {
    this.doctorDepartement = undefined;
    this.docAvatar = undefined;
  }

  if (this.role !== "Patient") {
    this.priorityStatus = undefined;
    this.admitted = undefined;
    this.bedNumber = undefined;
  }

  next();
});

// ✅ Compare password for login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Generate JWT token
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);

export default User;
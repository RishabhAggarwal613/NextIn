// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalid_email"],
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 20, // bcrypt hashes are ~60 chars, ensure it's not plain text
    },
  },
  { timestamps: true }
);

// Helpful compound index for login lookups
userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);

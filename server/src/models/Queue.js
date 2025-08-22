// src/models/Queue.js
import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    ticket: {
      type: Number,
      required: true,
      min: 1,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { _id: false }
);

const queueSchema = new mongoose.Schema(
  {
    queueId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      minlength: 6,
      maxlength: 6,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    isOpen: {
      type: Boolean,
      default: true,
      index: true,
    },

    entries: [entrySchema],

    nextTicket: { type: Number, default: 1, min: 1 },
    servedTicket: { type: Number, default: 0, min: 0 },

    avgServiceMs: {
      type: Number,
      default: 5 * 60 * 1000, // ~5 minutes
      min: 1000,
    },
    statsWindow: {
      type: Number,
      default: 10,
      min: 1,
      max: 100,
    },
    lastServedAt: { type: Date },
  },
  { timestamps: true }
);

// Index for fast dashboard queries
queueSchema.index({ owner: 1, createdAt: -1 });
queueSchema.index({ updatedAt: -1 });

export default mongoose.model("Queue", queueSchema);

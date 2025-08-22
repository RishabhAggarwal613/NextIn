import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    ticket: { type: Number, required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const queueSchema = new mongoose.Schema(
  {
    queueId: { type: String, required: true, unique: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    isOpen: { type: Boolean, default: true },

    entries: [entrySchema],

    nextTicket: { type: Number, default: 1 },
    servedTicket: { type: Number, default: 0 },

    avgServiceMs: { type: Number, default: 5 * 60 * 1000 }, // ~5 minutes
    statsWindow: { type: Number, default: 10 },
    lastServedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Queue", queueSchema);

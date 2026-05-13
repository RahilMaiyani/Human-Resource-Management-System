import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  // Who did it?
  performerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // What happened? (e.g., "LEAVE_APPROVED", "BALANCE_ADJUSTED")
  action: {
    type: String,
    required: true,
  },
  // Which specific item was affected?
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // What type of item was it? (e.g., "Leave", "User", "Document")
  targetModel: {
    type: String,
    required: true,
    enum: ["User", "Leave", "Document", "Ticket"],
  },
  // Snapshots for transparency
  oldData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  newData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  // Contextual reason (Optional)
  reason: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AuditLog", auditLogSchema);
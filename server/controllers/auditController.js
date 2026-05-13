import AuditLog from "../models/AuditLog.js";

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("performerId", "name email profilePic") // Get the Admin/User details
      .sort({ timestamp: -1 }) // Newest first
      .limit(100); // Limit to last 100 for performance
      
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch audit logs" });
  }
};
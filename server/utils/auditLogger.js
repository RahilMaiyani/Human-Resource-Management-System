import AuditLog from "../models/AuditLog.js";

/**
 * Creates a system audit log entry
 * @param {string} performerId - ID of the user performing the action
 * @param {string} action - Action identifier
 * @param {string} targetId - ID of the affected resource
 * @param {string} targetModel - Name of the Mongoose Model
 * @param {object} oldData - State before change
 * @param {object} newData - State after change
 */
export const createAuditLog = async (
  performerId,
  action,
  targetId,
  targetModel,
  oldData = null,
  newData = null
) => {
  try {
    const log = new AuditLog({
      performerId,
      action,
      targetId,
      targetModel,
      oldData,
      newData,
    });
    await log.save();
  } catch (error) {
    console.error("Audit Logging Failed:", error);
    // We don't throw here to ensure the main business process doesn't crash 
    // just because a log failed to write.
  }
};
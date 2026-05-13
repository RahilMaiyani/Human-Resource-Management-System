import express from "express";
// Import the new controller function we'll create next
import { getAuditLogs } from "../controllers/auditController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/audit-logs", protect, authorize("admin"), getAuditLogs);

export default router;
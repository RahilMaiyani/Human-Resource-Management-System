import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  getPendingLeavesCount,
  getActiveLeaves
} from "../controllers/leaveController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Employee
router.post("/", protect, applyLeave);
router.get("/me", protect, getMyLeaves);

// Admin
router.get("/", protect, authorize('admin'), getAllLeaves);
router.patch("/:id", protect, authorize('admin'), updateLeaveStatus);
router.get("/pending-count", protect, authorize('admin'), getPendingLeavesCount);
router.get("/active", protect, authorize('admin'), getActiveLeaves);

export default router;
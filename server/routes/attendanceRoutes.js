import express from "express";
import {
  checkIn,
  checkOut,
  todayAttendance,
  getAllAttendance,
  getUserAttendance,
  getMyAttendance,
  getAttendanceFilters
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/check-in", protect, checkIn);
router.post("/check-out", protect, checkOut);
router.get("/today", protect, todayAttendance);
router.get("/all", protect, getAllAttendance);
router.get("/user/:userId", protect, getUserAttendance);

router.get("/filters", protect, getAttendanceFilters);
router.get("/me", protect, getMyAttendance);

export default router;
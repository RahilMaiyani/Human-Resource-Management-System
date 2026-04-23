import express from "express";
import {
  checkIn,
  checkOut,
  todayAttendance,
  getAllAttendance,
  getUserAttendance
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/check-in", protect, checkIn);
router.post("/check-out", protect, checkOut);
router.get("/today", protect, todayAttendance);
router.get("/all", protect, getAllAttendance);
router.get("/user/:userId", protect, getUserAttendance);


export default router;
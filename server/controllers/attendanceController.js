import Attendance from "../models/Attendance.js";
import mongoose from "mongoose";

// CHECK-IN
export const checkIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const exists = await Attendance.findOne({
      userId: req.user.id,
      date: today
    });

    if (exists) {
      return res.status(400).json({ msg: "Already checked in" });
    }

    const record = await Attendance.create({
      userId: req.user.id,
      date: today,
      checkIn: new Date()
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ msg: "Check-in failed" });
  }
};

// CHECK-OUT
export const checkOut = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const record = await Attendance.findOne({
      userId: req.user.id,
      date: today
    });

    if (!record) {
      return res.status(400).json({ msg: "Check-in first" });
    }

    record.checkout = new Date(); 
    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ msg: "Check-out failed" });
  }
};

// TODAY ATTENDANCE
export const todayAttendance = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const data = await Attendance.find({ date: today }).populate(
      "userId",
      "-password"
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching attendance" });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const data = await Attendance.find();

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching attendance" });
  }
};

export const getUserAttendance = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    const record = await Attendance.findOne({
      userId: new mongoose.Types.ObjectId(userId)
    }).sort({ checkIn: -1 }); // 🔥 IMPORTANT

    res.json(record || null);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching attendance" });
  }
};
import Leave from "../models/Leave.js";
import { sendEmail } from "../utils/sendEmail.js";
import User from "../models/User.js";

export const applyLeave = async (req, res) => {
  try {
    const { type, fromDate, toDate, reason } = req.body;

    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({ msg: "Invalid date range" });
    }

    const overlapping = await Leave.findOne({
      userId: req.user.id,
      $or: [
        {
          fromDate: { $lte: toDate },
          toDate: { $gte: fromDate }
        }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ msg: "Leave already exists in this range" });
    }

    const leave = await Leave.create({
      userId: req.user.id,
      type,
      fromDate,
      toDate,
      reason
    });

    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getActiveLeaves = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const leaves = await Leave.find({
      $or: [
        { status: "pending" },
        { toDate: { $gte: today } }
      ]
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getPendingLeavesCount = async (req, res) => {
  try {
    const count = await Leave.countDocuments({ status: "pending" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch pending count" });
  }
};


export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ msg: "Leave not found" });
    }

    leave.status = status;
    await leave.save();

    const user = await User.findById(leave.userId);

    if (user) {
      const color =
        status === "approved"
          ? "green"
          : status === "rejected"
          ? "red"
          : "orange";

    sendEmail({
        to: user.email,
        subject: "Leave Request Update",
        html: `
            <div style="background:#f4f6f8;padding:20px 0;font-family:Arial,sans-serif;">
            <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">
                
                <!-- Header -->
                <div style="background:${
                status === "approved"
                    ? "#16a34a"
                    : status === "rejected"
                    ? "#dc2626"
                    : "#f59e0b"
                };padding:20px;text-align:center;color:white;">
                <h2 style="margin:0;font-size:20px;">
                    Leave ${status.toUpperCase()}
                </h2>
                </div>

                <!-- Body -->
                <div style="padding:24px;color:#374151;">
                <p style="margin:0 0 12px 0;">Hello <b>${user.name}</b>,</p>

                <p style="margin:0 0 16px 0;">
                    Your leave request has been 
                    <b style="color:${
                    status === "approved"
                        ? "#16a34a"
                        : status === "rejected"
                        ? "#dc2626"
                        : "#f59e0b"
                    };">
                    ${status}
                    </b>.
                </p>

                <!-- Details Card -->
                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px;">
                    <p style="margin:6px 0;"><b>Type:</b> ${leave.type}</p>
                    <p style="margin:6px 0;"><b>From:</b> ${leave.fromDate.toISOString().slice(0, 10)}</p>
                    <p style="margin:6px 0;"><b>To:</b> ${leave.toDate.toISOString().slice(0, 10)}</p>
                </div>

                <p style="font-size:14px;color:#6b7280;margin-top:20px;">
                    If you have any questions, please contact your administrator.
                </p>
                </div>

                <!-- Footer -->
                <div style="background:#f9fafb;padding:14px;text-align:center;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} HRMS System
                </div>

            </div>
            </div>
        `
        }).catch(console.error);
    }

    res.json(leave);
  } catch (err) {
    res.status(500).json({ msg: "Error updating leave" });
  }
};
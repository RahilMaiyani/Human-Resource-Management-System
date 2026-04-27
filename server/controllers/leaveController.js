import Leave from "../models/Leave.js";
import { sendEmail } from "../utils/sendEmail.js";
import { buildEmailTemplate } from "../utils/emailTemplate.js";
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
    const leaves = await Leave.find({ userId: req.user.id }).populate("userId", "name email profilePic").sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("userId", "name email profilePic")
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
      .populate("userId", "name email profilePic")
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
    const { status, adminComment } = req.body;

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ msg: "Leave not found" });
    }

    leave.status = status;

    if (adminComment) {
      leave.adminComment = adminComment;
    }

    await leave.save();

    const user = await User.findById(leave.userId);

    if (user) {
      const statusColor =
        status === "approved"
          ? "#16a34a"
          : status === "rejected"
          ? "#dc2626"
          : "#f59e0b";

      const html = buildEmailTemplate({
        title: `Leave ${status.toUpperCase()}`,
        color: statusColor,
        message: `
          <p style="margin:0 0 16px 0;">
            Hello <b>${user.name}</b>,
          </p>

          <p style="margin:0 0 18px 0;font-size:15px;">
            Your leave request has been 
            <span style="
              background:${statusColor}15;
              color:${statusColor};
              padding:4px 10px;
              border-radius:6px;
              font-weight:600;
              text-transform:capitalize;
            ">
              ${status}
            </span>
          </p>

          <div style="
            background:#f9fafb;
            border:1px solid #e5e7eb;
            border-radius:10px;
            padding:18px;
            margin-bottom:20px;
          ">
            <p style="margin:6px 0;"><b>Leave Type:</b> ${leave.type}</p>
            <p style="margin:6px 0;"><b>From:</b> ${leave.fromDate.toISOString().slice(0, 10)}</p>
            <p style="margin:6px 0;"><b>To:</b> ${leave.toDate.toISOString().slice(0, 10)}</p>
          </div>

          ${
            adminComment
              ? `
              <div style="
                background:#fff7ed;
                border:1px solid #fed7aa;
                border-radius:10px;
                padding:16px;
                margin-bottom:20px;
              ">
                <p style="margin:0 0 6px 0;font-weight:600;color:#9a3412;">
                  Admin Comment
                </p>
                <p style="margin:0;color:#7c2d12;">
                  ${adminComment}
                </p>
              </div>
            `
              : ""
          }

          <p style="font-size:14px;color:#6b7280;margin-top:10px;">
            If you have any questions, feel free to reach out to HR.
          </p>
        `
      });

      await sendEmail({
        to: user.email,
        subject: "Leave Request Update",
        html
      });
    }

    res.json(leave);
  } catch (err) {
    res.status(500).json({ msg: "Error updating leave" });
  }
};
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { buildEmailTemplate } from "../utils/emailTemplate.js";

export const createTicket = async (req, res) => {
  try {
    // SECURITY BLOCK: Prevent Admins from creating tickets
    if (req.user.role === "admin") {
      return res.status(403).json({ msg: "Admins cannot create support tickets." });
    }

    const { subject, description, category, priority } = req.body;
    
    const newTicket = await Ticket.create({
      userId: req.user._id,
      subject,
      description,
      category,
      priority
    });

    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ msg: "Failed to create ticket", error: error.message });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id }).sort("-createdAt");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};


export const getAllTickets = async (req, res) => {
  try {
    
    const tickets = await Ticket.find().populate("userId", "name email profilePic").sort("-createdAt");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

export const addReply = async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    if (req.user.role !== "admin" && ticket.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const newReply = {
      senderId: req.user._id,
      senderName: req.user.name,
      role: req.user.role,
      message
    };

    ticket.replies.push(newReply);

    
    if (req.user.role === "employee" && ticket.status === "Resolved") {
      ticket.status = "In-Progress";
    }

    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ msg: "Failed to add reply" });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id).populate("userId", "name email");

    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    // Only Admins can set "In-Progress" or "Resolved". 
    // Employees can only set "Closed".
    if (req.user.role !== "admin" && status !== "Closed") {
      return res.status(403).json({ msg: "Not authorized to set this status" });
    }

    ticket.status = status;
    await ticket.save();

    // EMAIL INTEGRATION: Notify employee when Admin resolves the ticket
    if (status === "Resolved") {
      const html = buildEmailTemplate({
        title: "Ticket Resolved",
        color: "#10b981",
        message: `<p>Hi ${ticket.userId.name},</p>
                  <p>Your ticket regarding <b>"${ticket.subject}"</b> has been marked as <b>Resolved</b> by our team.</p>
                  <p>Please log in to your dashboard to review the solution. If everything looks good, you can close the ticket. If you still need help, simply reply to the ticket to reopen it.</p>`
      });

      await sendEmail({
        to: ticket.userId.email,
        subject: `Resolved: ${ticket.subject}`,
        html
      });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ msg: "Failed to update status" });
  }
};
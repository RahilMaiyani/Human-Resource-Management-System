import Announcement from "../models/Announcement.js";

export const getAnnouncements = async (req, res) => {
  try {
    const isAdmin = req.user.role?.toLowerCase() === "admin";
    let query = {};

    if (!isAdmin) {
      query = {
        status: "Active",
        expiresAt: { $gte: new Date() }
      };
    }

    const announcements = await Announcement.find(query)
      .populate("createdBy", "name")
      .sort("-createdAt");

    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch announcements" });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Not authorized." });

    const { title, message, type, targetDepartments, expiresAt } = req.body;
    
    const newAnnouncement = await Announcement.create({
      title,
      message,
      type,
      targetDepartments: targetDepartments?.length ? targetDepartments : ["All"],
      expiresAt,
      createdBy: req.user._id || req.user.id
    });

    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ msg: "Failed to create announcement" });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Not authorized." });

    const updated = await Announcement.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: 'after' }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ msg: "Failed to update announcement" });
  }
};

export const archiveAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Not authorized" });
    
    const updated = await Announcement.findByIdAndUpdate(
        req.params.id, 
        { status: "Archived" }, 
        { returnDocument: 'after' }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ msg: "Failed to archive" });
  }
};
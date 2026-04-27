import User from "../models/User.js";
import Leave from "../models/Leave.js";
import Attendance from "../models/Attendance.js"; // make sure this exists
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department, profilePic } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      department,
      profilePic
    });

    const { password: _, ...safeUser } = user._doc;

    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ msg: "Error creating user" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { search, sort } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let users = User.find(query).select("-password");

    if (sort) users = users.sort(sort);

    const result = await users;

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role === "employee" && req.user.id !== id) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    const currentUser = await User.findById(id);
    if (!currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      returnDocument: "after"
    }).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error updating user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ msg: "Cannot delete admin" });
    }
    
    await Leave.deleteMany({ userId: id });
    await Attendance.deleteMany({ userId: id });
    
    await User.findByIdAndDelete(id);

    res.json({ msg: "User and related data deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting user" });
  }
};
import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(errorMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/email", emailRoutes);

app.get("/", (req, res) => {
    res.send("OfficeLink API Running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port : ${process.env.PORT}`);
});
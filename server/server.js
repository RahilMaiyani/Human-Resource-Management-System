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
import documentRoutes from "./routes/documentRoutes.js";
import ticketRoutes from './routes/ticketRoutes.js';
import announcementRoutes from "./routes/announcementRoutes.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import logRoutes from "./routes/logRouter.js";
dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',           // Local Development
  'http://localhost:4173',
  process.env.CLIENT_URL,           // Your Production Frontend
  'https://officelink-q3dppywc0-xyzerg808-5448s-projects.vercel.app/',
  'https://officelink-ui-git-main-xyzerg808-5448s-projects.vercel.app/',
  'https://officelink-ui.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.log("CORS Blocked Origin:", origin);
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/announcements", announcementRoutes);

app.use("/api/logs", logRoutes);

app.get("/", (req, res) => {
    res.send("OfficeLink API Running");
});

app.use(errorMiddleware);


if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`>> Server running on port ${PORT}`));
}

export default app;
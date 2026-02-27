import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "../routes/auth.js";
import activitiesRoutes from "../routes/activities.js";
import calendarRoutes from "../routes/calendar.js";
import postRoutes from "../routes/posts.js"
import courseRoutes from "../routes/course.js"

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.PRODUCTION_URL : process.env.DEVELOPMENT_URL,
    credentials: true,              
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/session", activitiesRoutes);

app.use("/api", calendarRoutes);

app.use("/api", postRoutes);

app.use("/api", courseRoutes);

export default app;
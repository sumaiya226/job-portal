import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import jobRoutes from "./src/routes/job.routes.js";
import appRoutes from "./src/routes/application.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// DB
await connectDB();

// Static uploads
const uploadsDir = path.join(__dirname, process.env.UPLOAD_DIR || "uploads");
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", appRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admin", adminRoutes);

// Root
app.get("/", (req,res)=> res.json({ ok: true, name: "Job Portal API" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, ()=> console.log(`API running on http://localhost:${PORT}`));

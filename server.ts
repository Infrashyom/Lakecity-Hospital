import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import insuranceRoutes from "./routes/insuranceRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";

dotenv.config();

async function startServer() {
  const app = express();
  const isDev = process.argv.includes("--dev");
  const PORT = isDev ? 3001 : process.env.PORT || 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Database Connection
  await connectDB();

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Lake City Caring Partners API is running" });
  });

  app.use("/api/doctors", doctorRoutes);
  app.use("/api/appointments", appointmentRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/departments", departmentRoutes);
  app.use("/api/leads", leadRoutes);
  app.use("/api/content", contentRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/settings", settingRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/insurances", insuranceRoutes);
  app.use("/api/analytics", analyticsRoutes);

  // Global Error Handler (Add this after the routes)
  app.use(globalErrorHandler);

  // Serve static files in production
  if (!isDev) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});

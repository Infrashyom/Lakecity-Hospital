import express from "express";
import {
  createAppointment,
  getAppointments,
  getMyAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/", createAppointment);
router.get("/my-appointments", getMyAppointments);

// Protected routes (Admin)
router.use(protect);
router.get("/", getAppointments);
router.put("/:id/status", updateAppointmentStatus);
router.delete("/:id", deleteAppointment);

export default router;

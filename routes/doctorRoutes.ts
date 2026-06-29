import express from "express";
import {
  createDoctor,
  deleteDoctor,
  getDoctorById,
  getDoctors,
  updateDoctor,
} from "../controllers/doctorController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getDoctors);
router.get("/:id", getDoctorById);

// Protected routes (Admin only)
router.use(protect);
router.post("/", createDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;

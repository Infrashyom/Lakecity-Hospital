import express from "express";
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} from "../controllers/leadController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes (e.g. from Contact Form)
router.post("/", createLead);

// Protected routes (Admin)
router.use(protect);
router.get("/", getLeads);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

export default router;

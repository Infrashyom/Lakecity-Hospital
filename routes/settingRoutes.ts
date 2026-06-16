import express from "express";
import { getSettings, saveSettings } from "../controllers/settingController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public route to get settings
router.get("/", getSettings);

// Protected routes (Admin)
router.use(protect);
router.post("/", saveSettings);

export default router;

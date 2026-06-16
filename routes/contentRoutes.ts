import express from "express";
import {
  getContents,
  createContent,
  updateContent,
  deleteContent,
} from "../controllers/contentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public route to get contents
router.get("/", getContents);

// Protected routes (Admin)
router.use(protect);
router.post("/", createContent);
router.put("/:id", updateContent);
router.delete("/:id", deleteContent);

export default router;

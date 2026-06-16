import express from "express";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getReviews);
router.post("/", createReview);

// Protected routes (Admin)
router.use(protect);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;

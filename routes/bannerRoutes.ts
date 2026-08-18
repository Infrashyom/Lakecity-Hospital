import express from "express";
import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
  updateBannerOrder,
} from "../controllers/bannerController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getBanners);

// Protected routes (Admin)
router.use(protect);
router.post("/", createBanner);
router.post("/reorder", updateBannerOrder);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);

export default router;

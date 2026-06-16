import express from "express";
import upload from "../middleware/upload.js";
import { uploadImage } from "../controllers/uploadController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // Secure this route with auth middleware

// Route: POST /api/upload
router.post("/", upload.single("image"), uploadImage);

export default router;

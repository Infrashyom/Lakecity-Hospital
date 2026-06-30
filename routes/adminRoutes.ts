import express from "express";
import { changePassword, checkAdminExists, login, requestPasswordChangeOtp, setupInitialAdmin, verifyOTP } from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/check", checkAdminExists);
router.post("/login", login);
router.post("/verify", verifyOTP);
router.post("/setup", setupInitialAdmin);

// Protected routes
router.use(protect);
router.post("/request-password-change-otp", requestPasswordChangeOtp);
router.post("/change-password", changePassword);

export default router;

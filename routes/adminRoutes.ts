import express from "express";
import { login, verifyOTP, setupInitialAdmin, changePassword, checkAdminExists } from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/check", checkAdminExists);
router.post("/login", login);
router.post("/verify", verifyOTP);
router.post("/setup", setupInitialAdmin);

// Protected routes
router.use(protect);
router.post("/change-password", changePassword);

export default router;

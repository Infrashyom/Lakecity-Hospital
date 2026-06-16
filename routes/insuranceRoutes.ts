import express from "express";
import {
  getInsurances,
  createInsurance,
  updateInsurance,
  deleteInsurance,
} from "../controllers/insuranceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getInsurances);

// Protected routes
router.use(protect);
router.post("/", createInsurance);
router.put("/:id", updateInsurance);
router.delete("/:id", deleteInsurance);

export default router;

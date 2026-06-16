import express from "express";
import AnalyticsClick from "../models/AnalyticsClick.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/click", async (req, res) => {
  try {
    const { type, sourcePage } = req.body;
    if (!["whatsapp", "phone"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }
    const click = new AnalyticsClick({ type, sourcePage });
    await click.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/clicks", protect, async (req, res) => {
  try {
    const clicks = await AnalyticsClick.find().sort({ createdAt: -1 });
    res.json(clicks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;

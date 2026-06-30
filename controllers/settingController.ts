import { NextFunction, Request, Response } from "express";
import Admin from "../models/Admin.js";
import { catchAsync } from "../utils/catchAsync.js";

// Get settings
export const getSettings = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  let admin;
  
  // Try to authenticate if token is present
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const jwt = await import("jsonwebtoken");
      const decoded: any = jwt.default.verify(token, process.env.JWT_SECRET || "fallback_secret");
      req.user = { id: decoded.id };
    } catch (e) {
      // Ignore token errors for public access
    }
  }

  if (req.user && req.user.id) {
    admin = await Admin.findById(req.user.id).select("-passwordHash -otpCode -otpExpiry");
  } else {
    admin = await Admin.findOne().select("-passwordHash -otpCode -otpExpiry");
  }
  res.status(200).json(admin || {});
});

// Create or update settings
export const saveSettings = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  let admin = null;
  if (req.user && req.user.id) {
    admin = await Admin.findById(req.user.id);
  } else {
    admin = await Admin.findOne();
  }
  
  if (admin) {
    const { email, passwordHash, otpCode, otpExpiry, ...settingsData } = req.body;
    
    if (settingsData.emails && settingsData.emails.length > 0 && settingsData.emails[0]) {
      (settingsData as any).email = settingsData.emails[0];
    }

    try {
      admin = await Admin.findByIdAndUpdate(admin._id, settingsData, { 
         new: true,
         runValidators: true
      }).select("-passwordHash -otpCode -otpExpiry");
    } catch (err: any) {
      return res.status(400).json({ message: err.message || "Failed to save settings" });
    }
  } else {
    return res.status(404).json({ message: "Admin account not found. Please setup admin first." });
  }

  res.status(200).json(admin);
});

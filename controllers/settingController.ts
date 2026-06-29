import { NextFunction, Request, Response } from "express";
import Admin from "../models/Admin.js";
import { catchAsync } from "../utils/catchAsync.js";

// Get settings
export const getSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const admin = await Admin.findOne().select("-passwordHash -otpCode -otpExpiry") || {};
  res.status(200).json(admin);
});

// Create or update settings
export const saveSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let admin = await Admin.findOne();
  
  if (admin) {
    const { email, passwordHash, otpCode, otpExpiry, ...settingsData } = req.body;
    admin = await Admin.findByIdAndUpdate(admin._id, settingsData, { 
       new: true,
       runValidators: true
    }).select("-passwordHash -otpCode -otpExpiry");
  } else {
    return res.status(404).json({ message: "Admin account not found. Please setup admin first." });
  }

  res.status(200).json(admin);
});

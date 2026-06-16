import { Request, Response, NextFunction } from "express";
import Setting from "../models/Setting.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Get settings
export const getSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const setting = await Setting.findOne();
  res.status(200).json(setting || {});
});

// Create or update settings
export const saveSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let setting = await Setting.findOne();
  if (setting) {
    setting = await Setting.findByIdAndUpdate(setting._id, req.body, { 
       new: true,
       runValidators: true
    });
  } else {
    setting = await Setting.create(req.body);
  }
  res.status(200).json(setting);
});

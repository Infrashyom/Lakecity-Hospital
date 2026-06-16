import { Request, Response, NextFunction } from "express";
import Insurance from "../models/Insurance.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Get all insurances
export const getInsurances = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const insurances = await Insurance.find().sort({ name: 1 });
  res.status(200).json(insurances);
});

// Create an insurance provider
export const createInsurance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const insurance = await Insurance.create(req.body);
  res.status(201).json(insurance);
});

// Update an insurance provider
export const updateInsurance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const insurance = await Insurance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!insurance) {
    return next(new AppError("Insurance provider not found", 404));
  }

  res.status(200).json(insurance);
});

// Delete an insurance provider
export const deleteInsurance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const insurance = await Insurance.findByIdAndDelete(req.params.id);

  if (!insurance) {
    return next(new AppError("Insurance provider not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

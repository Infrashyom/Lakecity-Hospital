import { Request, Response, NextFunction } from "express";
import Lead from "../models/Lead.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Get all leads
export const getLeads = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.status(200).json(leads);
});

// Create a lead
export const createLead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const lead = await Lead.create(req.body);
  res.status(201).json(lead);
});

// Update a lead
export const updateLead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!lead) {
    return next(new AppError("Lead not found", 404));
  }

  res.status(200).json(lead);
});

// Delete a lead
export const deleteLead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);

  if (!lead) {
    return next(new AppError("Lead not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

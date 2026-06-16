import { Request, Response, NextFunction } from "express";
import Content from "../models/Content.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Get all contents
export const getContents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = req.query.type ? { type: req.query.type as string } : {};
  const contents = await Content.find(filter).sort({ createdAt: -1 });
  res.status(200).json(contents);
});

// Create a content entry
export const createContent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const content = await Content.create(req.body);
  res.status(201).json(content);
});

// Update a content entry
export const updateContent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const content = await Content.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!content) {
    return next(new AppError("Content not found", 404));
  }

  res.status(200).json(content);
});

// Delete a content entry
export const deleteContent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const content = await Content.findByIdAndDelete(req.params.id);

  if (!content) {
    return next(new AppError("Content not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

import { Request, Response, NextFunction } from "express";
import Review from "../models/Review.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Get all reviews
export const getReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.status(200).json(reviews);
});

// Create a review
export const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const review = await Review.create(req.body);
  res.status(201).json(review);
});

// Update a review
export const updateReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  res.status(200).json(review);
});

// Delete a review
export const deleteReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

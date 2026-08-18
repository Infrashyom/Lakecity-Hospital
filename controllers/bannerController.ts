import { NextFunction, Request, Response } from "express";
import Banner from "../models/Banner.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getBanners = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query.isActive ? { isActive: req.query.isActive === 'true' } : {};
  const banners = await Banner.find(query).sort({ order: 1 });
  res.status(200).json(banners);
});

export const createBanner = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const banner = await Banner.create(req.body);
  res.status(201).json(banner);
});

export const updateBanner = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!banner) return next(new AppError("Banner not found", 404));
  res.status(200).json(banner);
});

export const deleteBanner = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) return next(new AppError("Banner not found", 404));
  res.status(204).json({ status: "success", data: null });
});

export const updateBannerOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { banners } = req.body;
  if (!Array.isArray(banners)) {
    return next(new AppError("Invalid data format", 400));
  }

  for (const item of banners) {
    if (item._id && typeof item.order === 'number') {
      await Banner.findByIdAndUpdate(item._id, { order: item.order });
    }
  }

  res.status(200).json({ status: "success", message: "Order updated successfully" });
});

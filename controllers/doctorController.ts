import { Request, Response, NextFunction } from "express";
import Doctor, { IDoctor } from "../models/Doctor.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Get all doctors
export const getDoctors = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const doctors = await Doctor.find();
  res.status(200).json(doctors);
});

// Get doctor by ID
export const getDoctorById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return next(new AppError("Doctor not found", 404));
  }
  res.status(200).json(doctor);
});

// Create a doctor
export const createDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json(doctor);
});

// Update a doctor
export const updateDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doctor) {
    return next(new AppError("Doctor not found", 404));
  }

  res.status(200).json(doctor);
});

// Delete a doctor
export const deleteDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);

  if (!doctor) {
    return next(new AppError("Doctor not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

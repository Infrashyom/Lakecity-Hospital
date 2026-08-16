import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Get all doctors
export const getDoctors = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const doctors = await Doctor.find().populate("department", "name");
  res.status(200).json(doctors);
});

// Get doctor by ID
export const getDoctorById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  let doctor;

  if (mongoose.Types.ObjectId.isValid(id)) {
    doctor = await Doctor.findById(id).populate("department", "name");
  } else {
    // Treat id as a slug
    const searchName = id.replace(/-/g, ' ');
    // Case insensitive regex match for name
    doctor = await Doctor.findOne({ name: { $regex: new RegExp('^' + searchName.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&') + '$', 'i') } }).populate("department", "name");
  }

  if (!doctor) {
    return next(new AppError("Doctor not found", 404));
  }
  res.status(200).json(doctor);
});

// Create a doctor
export const createDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    console.error("Error creating doctor:", error);
    next(error);
  }
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

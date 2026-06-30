import { NextFunction, Request, Response } from "express";
import Appointment from "../models/Appointment.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Create an appointment
export const createAppointment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const appointment = await Appointment.create(req.body);
  res.status(201).json(appointment);
});

// Get all appointments (for admin/portal)
export const getAppointments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const appointments = await Appointment.find().populate("doctorId").populate("department");
  res.status(200).json(appointments);
});

// Get appointments for a specific email
export const getMyAppointments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.query;
  if (!email) {
    return next(new AppError("Email is required", 400));
  }
  
  const appointments = await Appointment.find({ email: email as string }).populate("doctorId");
  res.status(200).json(appointments);
});

// Update appointment status (for admin)
export const updateAppointmentStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  
  if (!appointment) {
    return next(new AppError("Appointment not found", 404));
  }
  
  res.status(200).json(appointment);
});

// Delete an appointment
export const deleteAppointment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  
  if (!appointment) {
    return next(new AppError("Appointment not found", 404));
  }
  
  res.status(204).json({
    status: "success",
    data: null,
  });
});

import { Request, Response, NextFunction } from "express";
import Department from "../models/Department.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Get all departments
export const getDepartments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const departments = await Department.find();
  res.status(200).json(departments);
});

// Create a department
export const createDepartment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const department = await Department.create(req.body);
  res.status(201).json(department);
});

// Update a department
export const updateDepartment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!department) {
    return next(new AppError("Department not found", 404));
  }

  res.status(200).json(department);
});

// Delete a department
export const deleteDepartment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const department = await Department.findByIdAndDelete(req.params.id);

  if (!department) {
    return next(new AppError("Department not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

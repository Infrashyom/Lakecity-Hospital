import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export interface CustomRequest extends Request {
  user?: any;
}

export const protect = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded: any = jwt.verify(token, JWT_SECRET);

  // 3) Check if admin still exists
  const currentAdmin = await Admin.findById(decoded.id);
  if (!currentAdmin) {
    return next(
      new AppError("The user belonging to this token does no longer exist.", 401)
    );
  }

  // Grant access to protected route
  req.user = currentAdmin;
  next();
});

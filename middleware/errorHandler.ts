import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error("ERROR 💥", err);

    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;
    
    // Define Mongoose cast error etc. if required
    if (error.name === "CastError") {
      error = new AppError(`Invalid ${error.path}: ${error.value}.`, 400);
    }
    if (error.code === 11000) {
      const value = err.message.match(/(["'])(\\?.)*?\1/)?.[0];
      error = new AppError(`Duplicate field value: ${value}. Please use another value!`, 400);
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(err.errors).map((el: any) => el.message);
      const message = `Invalid input data. ${errors.join(". ")}`;
      error = new AppError(message, 400);
    }
    if (error.name === "JsonWebTokenError") {
      error = new AppError("Invalid token. Please log in again!", 401);
    }
    if (error.name === "TokenExpiredError") {
      error = new AppError("Your token has expired! Please log in again.", 401);
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      error = new AppError("File is too large. Max size is 20MB.", 400);
    }
    if (error.message === "Only image files are allowed!") {
      error = new AppError("Invalid file type. Only image files are allowed.", 400);
    }
    
    sendErrorProd(error, res);
  }
};

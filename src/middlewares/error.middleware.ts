import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.ts";

export interface IApiError extends Error {
  statusCode?: number;
  status?: string;
  errors?: any[];
}

// Handler functions for JWT errors
const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token. Please login again.", 401);

const handleJwtExpired = () =>
  new ApiError("Expired token. Please login again.", 401);

export const globalError = (
  err: IApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error: any = { ...err, message: err.message, stack: err.stack };

  // Convert jsonwebtoken library errors to user-friendly ApiErrors
  if (err.name === "JsonWebTokenError") {
    error = handleJwtInvalidSignature();
  }
  if (err.name === "TokenExpiredError") {
    error = handleJwtExpired();
  }

  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  const response: any = {
    success: false,
    status: status,
    message: error.message,
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
    const errObj = { ...error };
    delete errObj.errors; // Remove duplicate errors list from dev output

    response.error = errObj;
  }

  res.status(statusCode).json(response);
};

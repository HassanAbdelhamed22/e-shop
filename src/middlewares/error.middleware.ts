import type { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  statusCode?: number;
  status?: string;
}

export const globalError = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      success: false,
      status: status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    res.status(statusCode).json({
      success: false,
      status: status,
      message: err.message,
    });
  }
};

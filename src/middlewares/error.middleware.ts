import type { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  statusCode?: number;
  status?: string;
  errors?: any[];
}

export const globalError = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  const response: any = {
    success: false,
    status: status,
    message: err.message,
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    const errObj = { ...err, message: err.message, stack: err.stack };
    delete errObj.errors; // Remove duplicate errors list

    response.error = errObj;
  }

  res.status(statusCode).json(response);
};

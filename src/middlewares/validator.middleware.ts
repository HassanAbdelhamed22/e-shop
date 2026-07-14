import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.ts";
import type { Request, Response, NextFunction } from "express";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ApiError(
        "Validation Error",
        400,
        errors.array().map((err) => ({
          field: err.type === "field" ? err.path : err.type,
          message: err.msg,
        }))
      )
    );
  }
  next();
};

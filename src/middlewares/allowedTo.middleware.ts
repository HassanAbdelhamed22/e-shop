import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.ts";

export const allowedTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role as string)) {
      throw new ApiError("You are not allowed to perform this action", 403);
    }
    next();
  };
};

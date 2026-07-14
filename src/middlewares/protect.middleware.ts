import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.ts";
import jwt from "jsonwebtoken";
import User from "../models/user.model.ts";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. check if token exists
  let token: string | undefined = undefined;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(
      "You are not logged in! Please log in to get access to this route",
      401,
    );
  }

  // 2. verify token and check if token is valid and not expired
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

  // 3. check if user exists and is active
  const user = await User.findById(decoded.userId as string);
  if (!user) {
    throw new ApiError(
      "The user that belong to this token does no longer exist",
      401,
    );
  }

  if (!user.active) {
    throw new ApiError("The user that belong to this token is inactive", 401);
  }

  // 4. check if user changed password after token was issued
  if (user.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (user.passwordChangedAt.getTime() / 1000) as unknown as string,
      10,
    );
    if (decoded.iat < changedTimestamp) {
      throw new ApiError("You changed your password, please login again", 401);
    }
  }

  next();
};

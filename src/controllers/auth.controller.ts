import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.ts";

/**
 * @desc    signup user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, phone } = req.body;

  const { user, token } = await authService.signup({
    name,
    email,
    password,
    phone,
  });

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    token,
    data: user,
  });
};

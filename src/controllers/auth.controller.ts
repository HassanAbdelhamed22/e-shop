import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.ts";
import type { IUser } from "../types/index.ts";

/**
 * @desc    signup user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
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

/**
 * @desc    Login user and generate a JWT token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login({ email, password } as IUser);

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    token,
    data: user,
  });
};

/**
 * @desc    Forgot password
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;

  await authService.forgotPassword({ email });

  res.status(200).json({
    status: "success",
    message: "Password reset code sent successfully",
  });
};

/**
 * @desc    Verify password reset code
 * @route   POST /api/v1/auth/verify-password-reset-code
 * @access  Public
 */
export const verifyPasswordResetCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { code } = req.body;

  await authService.verifyPasswordResetCode({ code });

  res.status(200).json({
    status: "success",
    message: "Password reset code verified successfully",
  });
};

/**
 * @desc    Reset password
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  const token = await authService.resetPassword({ email, newPassword });

  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
    token,
  });
};

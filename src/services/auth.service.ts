import User from "../models/user.model.ts";
import jwt from "jsonwebtoken";
import type { IUser } from "../types/index.ts";
import { ApiError } from "../utils/apiError.ts";
import bcrypt from "bcryptjs";

const generateToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN as any,
  });
};

/**
 * @desc    Create a new user and generate a JWT token
 * @param   userData signup information
 * @returns Object containing the created user and the generated JWT token
 */
export const signup = async (
  userData: IUser,
): Promise<{ user: IUser; token: string }> => {
  // 1- create user
  const user = await User.create(userData);

  // 2- generate token
  const token = generateToken({ userId: user._id });

  return { user, token };
};

/**
 * @desc    Login user and generate a JWT token
 * @param   userData login information
 * @returns Object containing the user and the generated JWT token
 */
export const login = async (
  userData: IUser,
): Promise<{ user: IUser; token: string }> => {
  const { email, password } = userData;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError("Invalid email or password", 404);
  }

  const isPasswordValid = await bcrypt.compare(password!, user.password!);

  if (!isPasswordValid) {
    throw new ApiError("Invalid email or password", 404);
  }

  const token = generateToken({ userId: user._id });

  return { user, token };
};

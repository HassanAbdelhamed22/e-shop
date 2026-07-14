import User from "../models/user.model.ts";
import jwt from "jsonwebtoken";
import type { IUser } from "../types/index.ts";

/**
 * @desc    Create a new user and generate a JWT token
 * @param   userData signup information
 * @returns Object containing the created user and the generated JWT token
 */
export const signup = async (
  userData: IUser
): Promise<{ user: IUser; token: string }> => {
  // 1- create user
  const user = await User.create(userData);

  // 2- generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN as any,
  });

  return { user, token };
};

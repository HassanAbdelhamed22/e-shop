import crypto from "crypto";
import User from "../models/user.model.ts";
import jwt from "jsonwebtoken";
import type { IUser } from "../types/index.ts";
import { ApiError } from "../utils/apiError.ts";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.ts";
import { getForgotPasswordTemplate } from "../utils/emailTemplate.ts";

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

/**
 * @desc    Change user password business logic
 */
export const changeUserPasswordService = async (
  userId: string,
  currentPassword?: string,
  newPassword?: string,
) => {
  // 1) Fetch user and explicitly select password
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(`No user for this id ${userId}`, 404);
  }

  // 2) Verify current password
  const isPasswordCorrect = await bcrypt.compare(
    currentPassword!,
    user.password!,
  );
  if (!isPasswordCorrect) {
    throw new ApiError("Incorrect password", 401);
  }

  // 3) Set raw password and passwordChangedAt
  user.password = newPassword!;
  user.passwordChangedAt = new Date(Date.now());
  await user.save();

  return user;
};

/**
 * @desc    Forgot password business logic
 */
export const forgotPassword = async ({ email }: { email: string }) => {
  // 1) Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError("No user for this email", 404);
  }

  // 2) If user exist, generate random 6-digit code and save it in db
  const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = crypto
    .createHash("sha256")
    .update(randomCode)
    .digest("hex");

  user.passwordResetCode = hashedCode;
  user.passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  user.passwordResetCodeVerify = false;

  await user.save();

  const message = `Hi ${user.name},\n\nTo reset your password, please use the following code: ${randomCode}\n\nThis code will expire in 10 minutes.\n\nBest regards,\nE-Shop App`;
  const htmlMessage = getForgotPasswordTemplate(user.name, randomCode);
  try {
    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      text: message,
      html: htmlMessage,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetCodeVerify = undefined;
    await user.save();

    throw new ApiError("Failed to send email", 500);
  }
};

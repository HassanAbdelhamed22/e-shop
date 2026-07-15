import crypto from "crypto";
import User from "../models/user.model.ts";
import type { IUser, UpdateUserData } from "../types/index.ts";
import fs from "fs";
import { ApiError } from "../utils/apiError.ts";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.ts";
import { getForgotPasswordTemplate } from "../utils/emailTemplate.ts";
import { generateToken } from "../utils/createToken.ts";

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

/**
 * @desc    Verify password reset code business logic
 */
export const verifyPasswordResetCode = async ({ code }: { code: string }) => {
  // 1) Get user based on reset code
  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
  const user = await User.findOne({
    passwordResetCode: hashedCode,
    passwordResetCodeExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError("Invalid or expired reset code", 400);
  }

  // 2) Reset code valid
  user.passwordResetCodeVerify = true;
  await user.save();
};

/**
 * @desc    Reset password business logic
 */
export const resetPassword = async ({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}) => {
  // 1) Get user based on email
  const user = await User.findOne({
    email,
    passwordResetCodeVerify: true,
  }).select("+password");

  if (!user) {
    throw new ApiError("No user for this email", 404);
  }

  // 2) Check if password reset code is verified
  if (!user.passwordResetCodeVerify) {
    throw new ApiError("Please verify your password reset code first", 400);
  }

  // 3) Check if new password is the same as current password
  const isPasswordCorrect = await bcrypt.compare(newPassword, user.password!);
  if (isPasswordCorrect) {
    throw new ApiError(
      "New password must be different from current password",
      400,
    );
  }

  // 4) Reset password
  user.password = newPassword;

  user.passwordChangedAt = new Date(Date.now());
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpires = undefined;
  user.passwordResetCodeVerify = undefined;

  await user.save();

  // 5) Generate a new token
  const token = generateToken({ userId: user._id });

  return token;
};

/**
 * @desc    Change my password business logic
 */
export const changeMyPasswordService = async (
  userId: string,
  currentPassword?: string,
  newPassword?: string,
) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(`No user for this id ${userId}`, 404);
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword!,
    user.password!,
  );
  if (!isPasswordCorrect) {
    throw new ApiError("Incorrect password", 401);
  }

  user.password = newPassword!;
  user.passwordChangedAt = new Date();
  await user.save();

  return user;
};

/**
 * @desc    Change user password by admin business logic
 */
export const changeUserPasswordByAdminService = async (
  userId: string,
  newPassword?: string,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(`No user for this id ${userId}`, 404);
  }

  user.password = newPassword!;
  user.passwordChangedAt = new Date();
  await user.save();

  return user;
};

/**
 * @desc    Update logged in user profile business logic (without password)
 */
export const updateMyProfileService = async (
  userId: string,
  updateData: UpdateUserData,
) => {
  // Delete old profile image if a new one is uploaded
  if (updateData.profileImage) {
    const user = await User.findById(userId);
    if (user && user.profileImage) {
      const oldImageFilename = user.profileImage.split("/").pop();
      const oldImagePath = `uploads/users/${oldImageFilename}`;
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (err) {
          // Log or silently ignore error if old image deletion fails
        }
      }
    }
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(`No user for this id ${userId}`, 404);
  }

  return user;
};
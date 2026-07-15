import User from "../models/user.model.ts";
import * as controllerFactory from "./handlersFactory.ts";
import {
  resizeImage,
  uploadSingleImage,
} from "../middlewares/uploadImage.middleware.ts";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.ts";
import type { UpdateUserData } from "../types/index.ts";
import * as authService from "../services/auth.service.ts";
import { generateToken } from "../utils/createToken.ts";

export const uploadUserImg = uploadSingleImage("profileImage");

export const resizeUserImg = resizeImage({
  width: 600,
  height: 600,
  folder: "users",
  prefix: "user",
  bodyFieldName: "profileImage",
});

// @desc    Get All Users
// @route   GET /api/v1/users
// @access  Private
export const getUsers = controllerFactory.getAll(User, "User");

// @desc    Get User By Id
// @route   GET /api/v1/users/:id
// @access  Private
export const getUserById = controllerFactory.getOne(User);

export const createUser = controllerFactory.createOne(User);

// @desc    Update User
// @route   PUT /api/v1/users/:id
// @access  Private
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const updateData: UpdateUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    role: req.body.role,
    active: req.body.active,
  };

  // The resizeUserImg middleware stores the processed filename in req.body.profileImage
  if (req.body.profileImage) {
    updateData.profileImage = req.body.profileImage;
  }

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

// @desc    Change User Password
// @route   PUT /api/v1/users/:id/change-password
// @access  Private
export const changeUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password } = req.body;
  const user = await authService.changeUserPasswordByAdminService(
    req.params.id as string,
    password,
  );
  res.status(200).json({
    success: true,
    data: user,
  });
};

// @desc    Delete User
// @route   DELETE /api/v1/users/:id
// @access  Private
export const deleteUser = controllerFactory.deleteOne(User);

// @desc    Get Logged In User
// @route   GET /api/v1/users/me
// @access  Private
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    return next(new ApiError(`No user for this id ${req.user?._id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

// @desc    Update Logged In User Password
// @route   PUT /api/v1/users/me/change-password
// @access  Private
export const updateMyPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { currentPassword, password } = req.body;
  const user = await authService.changeMyPasswordService(
    req.user?._id as string,
    currentPassword,
    password,
  );

  const token = generateToken({ userId: user._id });

  res.status(200).json({
    success: true,
    token,
    data: user,
  });
};

// @desc    Update logged in user profile
// @route   PUT /api/v1/users/me
// @access  Private
export const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const updateData: UpdateUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  if (req.body.profileImage) {
    updateData.profileImage = req.body.profileImage;
  }

  const user = await authService.updateMyProfileService(
    req.user?._id as string,
    updateData as UpdateUserData,
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
};

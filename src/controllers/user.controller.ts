import User from "../models/user.model.ts";
import * as controllerFactory from "./handlersFactory.ts";
import {
  resizeImage,
  uploadSingleImage,
} from "../middlewares/uploadImage.middleware.ts";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.ts";
import type { UpdateUserData } from "../types/index.ts";
import bcrypt from "bcryptjs";

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
  // 1) Explicitly select '+password' because select: false is set in the schema
  const user = await User.findById(req.params.id).select("+password");
  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }

  // 2) Verify current password
  const isPasswordCorrect = await bcrypt.compare(
    req.body.currentPassword,
    user.password,
  );

  if (!isPasswordCorrect) {
    return next(new ApiError("Incorrect password", 401));
  }

  // 3) Set raw password 
  user.password = req.body.password;
  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
};

// @desc    Delete User
// @route   DELETE /api/v1/users/:id
// @access  Private
export const deleteUser = controllerFactory.deleteOne(User);

import User from "../models/user.model.ts";
import * as controllerFactory from "./handlersFactory.ts";
import {
  resizeImage,
  uploadSingleImage,
} from "../middlewares/uploadImage.middleware.ts";

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
export const updateUser = controllerFactory.updateOne(User);

// @desc    Delete User
// @route   DELETE /api/v1/users/:id
// @access  Private
export const deleteUser = controllerFactory.deleteOne(User);

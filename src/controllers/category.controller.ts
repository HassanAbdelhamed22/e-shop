import type { Request } from "express";
import Category from "../models/category.model.ts";
import { ApiError } from "../utils/apiError.ts";
import * as controllerFactory from "./handlersFactory.ts";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/categories");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.mimetype.split("/")[1];
    const filename = `category-${uniqueSuffix}.${ext}`;
    cb(null, filename);
  },
});

const fileFilter = function (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Invalid file type, only images are allowed", 400));
  }
};

const upload = multer({ storage, fileFilter });
export const uploadCategoryImg = upload.single("image");

// @desc    Get All Categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = controllerFactory.getAll(Category, "Category");

// @desc    Get Category By Id
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategoryById = controllerFactory.getOne(Category);

export const createCategory = controllerFactory.createOne(Category);

// @desc    Update Category
// @route   PUT /api/v1/categories/:id
// @access  Private
export const updateCategory = controllerFactory.updateOne(Category);

// @desc    Delete Category
// @route   DELETE /api/v1/categories/:id
// @access  Private
export const deleteCategory = controllerFactory.deleteOne(Category);

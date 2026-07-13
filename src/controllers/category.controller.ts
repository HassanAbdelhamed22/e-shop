import type { NextFunction, Request, Response } from "express";
import Category from "../models/category.model.ts";
import * as controllerFactory from "./handlersFactory.ts";
import { uploadSingleImage, resizeImage } from "../middlewares/uploadImage.middleware.ts";

export const uploadCategoryImg = uploadSingleImage("image");

export const resizeImg = resizeImage({
  width: 600,
  height: 600,
  folder: "categories",
  prefix: "category",
});

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

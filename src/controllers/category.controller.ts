import type { Request, Response } from "express";
import * as categoryService from "../services/category.service.ts";
import type { ICategory } from "../types/index.ts";
import { ApiError } from "../utils/apiError.ts";
import Category from "../models/category.model.ts";
import * as controllerFactory from "./handlersFactory.ts";

// @desc    Get All Categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  const { categories, pagination } = await categoryService.getCategories(req.query);

  res.status(200).json({
    success: true,
    data: { categories, pagination },
  });
};

// @desc    Get Category By Id
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategoryById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const category = await categoryService.getCategoryById(id);
  if (!category) {
    throw new ApiError("Category not found", 404);
  }
  res.status(200).json({ success: true, data: { category } });
};

export const createCategory = controllerFactory.createOne(Category);

// @desc    Update Category
// @route   PUT /api/v1/categories/:id
// @access  Private
export const updateCategory = controllerFactory.updateOne(Category);

// @desc    Delete Category
// @route   DELETE /api/v1/categories/:id
// @access  Private
export const deleteCategory = controllerFactory.deleteOne(Category);

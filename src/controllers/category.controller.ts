import type { Request, Response } from "express";
import * as categoryService from "../services/category.service.ts";
import type { ICategory } from "../types/index.ts";

// @desc    Get All Categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const { categories, totalCount } = await categoryService.getCategories(
    page,
    limit,
  );

  const totalPages = Math.ceil(totalCount / limit);

  const pagination = {
    currentPage: page,
    limit,
    totalPages,
    totalCount,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

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
    res.status(404).json({ success: false, message: "Category not found" });
    return;
  }
  res.status(200).json({ success: true, data: { category } });
};

// @desc    Create Category
// @route   POST /api/v1/categories
// @access  Private
export const createCategory = async (req: Request, res: Response) => {
  const categoryData: ICategory = req.body;
  const category = await categoryService.createCategory(categoryData);
  res.status(201).json({ success: true, data: { category } });
};

// @desc    Update Category
// @route   PUT /api/v1/categories/:id
// @access  Private
export const updateCategory = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const categoryData: Partial<ICategory> = req.body;
  const category = await categoryService.updateCategory(id, categoryData);
  if (!category) {
    res.status(404).json({ success: false, message: "Category not found" });
    return;
  }
  res.status(200).json({ success: true, data: { category } });
};

// @desc    Delete Category
// @route   DELETE /api/v1/categories/:id
// @access  Private
export const deleteCategory = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const category = await categoryService.deleteCategory(id);
  if (!category) {
    res.status(404).json({ success: false, message: "Category not found" });
    return;
  }
  res
    .status(200)
    .json({ success: true, message: "Category deleted successfully" });
};

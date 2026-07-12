import type { Request, Response, NextFunction } from "express";
import * as subCategoryService from "../services/subCategory.service.ts";
import type { ISubCategory } from "../types/index.ts";
import { ApiError } from "../utils/apiError.ts";
import SubCategory from "../models/subCategory.model.ts";
import * as controllerFactory from "./handlersFactory.ts";

export const setCategoryIdToBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

export const createFilterObject = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

// @desc    Get All Sub Categories
// @route   GET /api/v1/subcategories
// @access  Public
export const getSubCategories = async (req: Request, res: Response) => {
  const { subCategories, pagination } =
    await subCategoryService.getSubCategories(req.query, req.filterObject);

  res.status(200).json({
    success: true,
    data: { subCategories, pagination },
  });
};

// @desc: Get subcategory by category ID
// @route: GET /api/v1/categories/:categoryId/subcategories
// @access: Public
export const getSubCategoriesByCategory = async (
  req: Request<{ categoryId: string }>,
  res: Response,
) => {
  const { categoryId } = req.params;
  const subCategories =
    await subCategoryService.getSubCategoriesByCategory(categoryId);
  res.status(200).json({ success: true, data: { subCategories } });
};

// @desc    Get Sub Category By Id
// @route   GET /api/v1/subcategories/:id
// @access  Public
export const getSubCategoryById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const subCategory = await subCategoryService.getSubCategoryById(id);
  if (!subCategory) {
    throw new ApiError("Subcategory not found", 404);
  }
  res.status(200).json({ success: true, data: { subCategory } });
};

export const createSubCategory = controllerFactory.createOne(SubCategory);

// @desc    Update Sub Category
// @route   PUT /api/v1/subcategories/:id
// @access  Private
export const updateSubCategory = controllerFactory.updateOne(SubCategory);

// @desc    Delete Sub Category
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
export const deleteSubCategory = controllerFactory.deleteOne(SubCategory);

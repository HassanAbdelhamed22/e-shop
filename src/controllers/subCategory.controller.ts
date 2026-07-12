import type { Request, Response, NextFunction } from "express";
import * as subCategoryService from "../services/subCategory.service.ts";
import type { ISubCategory } from "../types/index.ts";
import { ApiError } from "../utils/apiError.ts";

export const setCategoryIdToBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};



// @desc    Get All Sub Categories
// @route   GET /api/v1/subcategories
// @access  Public
export const getSubCategories = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const { subCategories, totalCount } =
    await subCategoryService.getSubCategories(page, limit, req.filterObject);

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

// @desc    Create Sub Category
// @route   POST /api/v1/subcategories
// @access  Private
export const createSubCategory = async (req: Request, res: Response) => {
  // nested route (create sub category)
  if (!req.body.category) req.body.category = req.params.categoryId;

  const subCategoryData: ISubCategory = req.body;
  const subCategory =
    await subCategoryService.createSubCategory(subCategoryData);
  res.status(201).json({ success: true, data: { subCategory } });
};

// @desc    Update Sub Category
// @route   PUT /api/v1/subcategories/:id
// @access  Private
export const updateSubCategory = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const subCategoryData: Partial<ISubCategory> = req.body;
  const subCategory = await subCategoryService.updateSubCategory(
    id,
    subCategoryData,
  );
  if (!subCategory) {
    throw new ApiError("Subcategory not found", 404);
  }
  res.status(200).json({ success: true, data: { subCategory } });
};

// @desc    Delete Sub Category
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
export const deleteSubCategory = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const subCategory = await subCategoryService.deleteSubCategory(id);
  if (!subCategory) {
    throw new ApiError("Subcategory not found", 404);
  }
  res
    .status(200)
    .json({ success: true, message: "Subcategory deleted successfully" });
};

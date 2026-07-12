import type { Request, Response, NextFunction } from "express";
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

export const getSubCategories = controllerFactory.getAll(SubCategory, "SubCategory", {
  path: "category",
  select: "name",
});

// @desc    Get Sub Category By Id
// @route   GET /api/v1/subcategories/:id
// @access  Public
export const getSubCategoryById = controllerFactory.getOne(SubCategory, {
  path: "category",
  select: "name",
});

export const createSubCategory = controllerFactory.createOne(SubCategory);

// @desc    Update Sub Category
// @route   PUT /api/v1/subcategories/:id
// @access  Private
export const updateSubCategory = controllerFactory.updateOne(SubCategory);

// @desc    Delete Sub Category
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
export const deleteSubCategory = controllerFactory.deleteOne(SubCategory);

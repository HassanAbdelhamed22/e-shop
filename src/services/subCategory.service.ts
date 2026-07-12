import Category from "../models/category.model.ts";
import SubCategory from "../models/subCategory.model.ts";
import type { ISubCategory } from "../types/index.ts";
import slugify from "slugify";
import { ApiFeatures } from "../utils/apiFeatures.ts";
import type { PaginationResult } from "../utils/apiFeatures.ts";

// @desc: Get all subcategories
// @route: GET /api/v1/subcategories
// @access: Public
export const getSubCategories = async (
  queryString: any,
  filter: Record<string, any> = {},
): Promise<{ subCategories: ISubCategory[]; pagination: PaginationResult }> => {
  const countFeatures = new ApiFeatures(SubCategory.find(filter), queryString)
    .filter()
    .search("SubCategory");

  const totalCount = await SubCategory.countDocuments(countFeatures.mongooseQuery.getFilter());

  const apiFeatures = new ApiFeatures(SubCategory.find(filter), queryString)
    .filter()
    .search("SubCategory")
    .sort()
    .limitFields()
    .pagination(totalCount);

  // Populate category name
  apiFeatures.mongooseQuery = apiFeatures.mongooseQuery.populate({
    path: "category",
    select: "name",
  });

  const subCategories = await apiFeatures.mongooseQuery;

  return { subCategories, pagination: apiFeatures.paginationResult! };
};

// @desc: Get subcategory by category ID
// @route: GET /api/v1/categories/:categoryId/subcategories
// @access: Public
export const getSubCategoriesByCategory = async (
  categoryId: string,
): Promise<ISubCategory[]> => {
  const subCategories = await SubCategory.find({
    category: categoryId,
  }).populate({
    path: "category",
    select: "name",
  });
  return subCategories;
};

// @desc: Get subcategory by ID
// @route: GET /api/v1/subcategories/:id
// @access: Public
export const getSubCategoryById = async (
  id: string,
): Promise<ISubCategory | null> => {
  const subCategory = await SubCategory.findById(id);
  return subCategory;
};

// @desc: Create subcategory
// @route: POST /api/v1/subcategories
// @access: Private
export const createSubCategory = async (
  subCategoryData: ISubCategory,
): Promise<ISubCategory> => {
  if (!subCategoryData.name) {
    throw new Error("Subcategory name is required");
  }

  // check if category exists
  const category = await Category.findById(subCategoryData.category);
  if (!category) {
    throw new Error("Category not found");
  }

  subCategoryData.slug = slugify(subCategoryData.name, { lower: true });
  const subCategory = await SubCategory.create(subCategoryData);
  return subCategory;
};

// @desc: Update subcategory
// @route: PUT /api/v1/subcategories/:id
// @access: Private
export const updateSubCategory = async (
  id: string,
  subCategoryData: Partial<ISubCategory>,
): Promise<ISubCategory | null> => {
  if (subCategoryData.name) {
    subCategoryData.slug = slugify(subCategoryData.name, { lower: true });
  }
  const subCategory = await SubCategory.findByIdAndUpdate(id, subCategoryData, {
    returnDocument: "after",
    runValidators: true,
  });
  return subCategory;
};

// @desc: Delete subcategory
// @route: DELETE /api/v1/subcategories/:id
// @access: Private
export const deleteSubCategory = async (
  id: string,
): Promise<ISubCategory | null> => {
  const subCategory = await SubCategory.findByIdAndDelete(id);
  return subCategory;
};

import Category from "../models/category.model.ts";
import SubCategory from "../models/subCategory.model.ts";
import type { ISubCategory } from "../types/index.ts";
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

  const totalCount = await SubCategory.countDocuments(
    countFeatures.mongooseQuery.getFilter(),
  );

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



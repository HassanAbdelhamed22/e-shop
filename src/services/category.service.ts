import Category from "../models/category.model.ts";
import type { ICategory } from "../types/index.ts";
import slugify from "slugify";
import { ApiFeatures } from "../utils/apiFeatures.ts";
import type { PaginationResult } from "../utils/apiFeatures.ts";

export const getCategories = async (
  queryString: any,
): Promise<{ categories: ICategory[]; pagination: PaginationResult }> => {
  const countFeatures = new ApiFeatures(Category.find(), queryString)
    .filter()
    .search("Category");

  const totalCount = await Category.countDocuments(countFeatures.mongooseQuery.getFilter());

  const apiFeatures = new ApiFeatures(Category.find(), queryString)
    .filter()
    .search("Category")
    .sort()
    .limitFields()
    .pagination(totalCount);

  const categories = await apiFeatures.mongooseQuery;

  return { categories, pagination: apiFeatures.paginationResult! };
};

export const getCategoryById = async (
  id: string,
): Promise<ICategory | null> => {
  const category = await Category.findById(id);
  return category;
};

export const createCategory = async (
  categoryData: ICategory,
): Promise<ICategory> => {
  if (!categoryData.name) {
    throw new Error("Category name is required");
  }
  categoryData.slug = slugify(categoryData.name, { lower: true });
  const category = await Category.create(categoryData);
  return category;
};

export const updateCategory = async (
  id: string,
  categoryData: Partial<ICategory>,
): Promise<ICategory | null> => {
  if (categoryData.name) {
    categoryData.slug = slugify(categoryData.name, { lower: true });
  }
  const category = await Category.findByIdAndUpdate(id, categoryData, {
    returnDocument: "after",
    runValidators: true,
  });
  return category;
};

export const deleteCategory = async (id: string): Promise<ICategory | null> => {
  const category = await Category.findByIdAndDelete(id);
  return category;
};

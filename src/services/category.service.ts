import Category from "../models/category.model.ts";
import type { ICategory } from "../types/index.ts";
import { ApiFeatures } from "../utils/apiFeatures.ts";
import type { PaginationResult } from "../utils/apiFeatures.ts";

export const getCategories = async (
  queryString: any,
): Promise<{ categories: ICategory[]; pagination: PaginationResult }> => {
  const countFeatures = new ApiFeatures(Category.find(), queryString)
    .filter()
    .search("Category");

  const totalCount = await Category.countDocuments(
    countFeatures.mongooseQuery.getFilter(),
  );

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

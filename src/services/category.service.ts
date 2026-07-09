import Category from "../models/category.model.ts";

export const createCategory = async (categoryData: { name: string }) => {
  return await Category.create(categoryData);
};

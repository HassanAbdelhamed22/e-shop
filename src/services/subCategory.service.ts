import Category from "../models/category.model.ts";
import SubCategory from "../models/subCategory.model.ts";
import type { ISubCategory } from "../types/index.ts";
import slugify from "slugify";

// @desc: Get all subcategories
// @route: GET /api/v1/subcategories
// @access: Public
export const getSubCategories = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ subCategories: ISubCategory[]; totalCount: number }> => {
  const skip = (page - 1) * limit;

  const [subCategories, totalCount] = await Promise.all([
    SubCategory.find().skip(skip).limit(limit).populate({
      path: "category",
      select: "name",
    }),
    SubCategory.countDocuments(),
  ]);

  return { subCategories, totalCount };
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

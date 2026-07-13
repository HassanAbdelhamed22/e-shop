import { check } from "express-validator";
import { validate } from "../../middlewares/validator.middleware.ts";
import Category from "../../models/category.model.ts";

export const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID"),
  validate,
];

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters")
    .custom(async (val: string) => {
      const category = await Category.findOne({ name: val });
      if (category) {
        throw new Error("Category name already exists");
      }
      return true;
    }),
  validate,
];

export const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID"),
  check("name").optional(),
  validate,
];

export const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID"),
  validate,
];

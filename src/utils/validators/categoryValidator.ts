import { check } from "express-validator";
import { validate } from "../../middlewares/validator.middleware.ts";

export const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID"),
  validate,
];

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters"),
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

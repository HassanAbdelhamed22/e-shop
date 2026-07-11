import { check } from "express-validator";
import { validate } from "../../middlewares/validator.middleware.ts";

export const getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory ID"),
  validate,
];

export const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Subcategory name must be between 3 and 100 characters"),
  check("category")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Invalid category ID"),
  validate,
];

export const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory ID"),
  check("name").optional(),
  validate,
];

export const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory ID"),
  validate,
];

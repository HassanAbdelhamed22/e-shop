import { check } from "express-validator";
import { validate } from "../../middlewares/validator.middleware.ts";

export const getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID"),
  validate,
];

export const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Brand name must be between 3 and 100 characters"),
  validate,
];

export const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID"),
  check("name").optional(),
  validate,
];

export const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID"),
  validate,
];

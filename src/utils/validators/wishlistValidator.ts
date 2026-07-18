import { check } from "express-validator";
import { validate } from "../../middlewares/validator.middleware.ts";

export const addProductToWishlistValidator = [
  check("productId").isMongoId().withMessage("Invalid Product ID"),
  validate,
];

export const removeProductFromWishlistValidator = [
  check("productId").isMongoId().withMessage("Invalid Product ID"),
  validate,
];

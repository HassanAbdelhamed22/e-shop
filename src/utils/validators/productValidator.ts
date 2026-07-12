import mongoose from "mongoose";
import { check } from "express-validator";
import { validate } from "../../middlewares/validator.middleware.ts";
import Category from "../../models/category.model.ts";
import { ApiError } from "../apiError.ts";
import SubCategory from "../../models/subCategory.model.ts";
import Brand from "../../models/brand.model.ts";

export const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID"),
  validate,
];

export const createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20, max: 1000 })
    .withMessage("Product description must be between 20 and 1000 characters"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product price after discount must be a number")
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("Price after discount must be less than price");
      }
      return true;
    }),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("colors").optional().isArray().withMessage("Colors must be an array"),
  check("imageCover").notEmpty().withMessage("Product image cover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an array"),
  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Product category must be a valid category ID")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(new ApiError("Category not found", 404));
        }
        return true;
      }),
    ),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("Product sub category must be an array of category IDs")
    .custom((value: string[]) => value.every((id: string) => mongoose.Types.ObjectId.isValid(id)))
    .withMessage("Product sub category must be valid IDs")
    .custom(async (subCategoryIds: string[], { req }) => {
      const uniqueIds = [...new Set(subCategoryIds)];
      const subCategories = await SubCategory.find({
        _id: { $in: uniqueIds },
      });

      if (subCategories.length !== uniqueIds.length) {
        throw new ApiError("One or more sub categories not found", 404);
      }

      const productCategory = req.body.category;
      if (productCategory) {
        const belongsToCategory = subCategories.every(
          (subCat) => subCat.category.toString() === productCategory
        );
        if (!belongsToCategory) {
          throw new ApiError("One or more sub categories do not belong to the selected category", 400);
        }
      }
      return true;
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Product brand must be a valid brand ID")
    .custom((brandId) =>
      Brand.findById(brandId).then((brand) => {
        if (!brand) {
          return Promise.reject(new ApiError("Brand not found", 404));
        }
        return true;
      }),
    ),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product ratings average must be a number"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratings quantity must be a number"),
  validate,
];

export const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID"),
  check("title").optional(),
  check("description").optional(),
  check("price").optional(),
  check("priceAfterDiscount").optional(),
  check("quantity").optional(),
  check("sold").optional(),
  check("colors").optional(),
  check("imageCover").optional(),
  check("images").optional(),
  check("category").optional(),
  check("subCategory").optional(),
  check("brand").optional(),
  check("ratingsAverage").optional(),
  check("ratingsQuantity").optional(),
  validate,
];

export const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID"),
  validate,
];

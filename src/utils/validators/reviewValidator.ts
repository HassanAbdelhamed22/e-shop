import { check } from "express-validator";
import { validate } from "../../middlewares/validator.middleware.ts";
import Review from "../../models/review.model.ts";
import { ApiError } from "../apiError.ts";

export const getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review ID"),
  validate,
];

export const createReviewValidator = [
  check("title")
    .notEmpty()
    .withMessage("Review title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Review title must be between 3 and 100 characters"),
  check("rating")
    .notEmpty()
    .withMessage("Review rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Review rating must be between 1 and 5"),
  check("comment")
    .optional()
    .isLength({ min: 3, max: 1000 })
    .withMessage("Review comment must be between 3 and 1000 characters"),
  check("user")
    .isMongoId()
    .withMessage("Invalid User ID")
    .custom((val, { req }) => {
      if (val.toString() !== req.user._id.toString()) {
        throw new ApiError("You can only create a review for yourself", 403);
      }
      return true;
    }),
  check("product")
    .isMongoId()
    .withMessage("Invalid Product ID")
    .custom(async (val, { req }) => {
      // check if logged in user used create review for this product before
      const review = await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) {
        throw new ApiError("You have already reviewed this product", 400);
      }

      return true;
    }),
  validate,
];

export const updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        throw new ApiError("Review not found", 404);
      }
      if (review.user?._id?.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to update this review", 403);
      }
      return true;
    }),
  check("title")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Review title must be between 3 and 100 characters"),
  check("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Review rating must be between 1 and 5"),
  check("comment")
    .optional()
    .isLength({ min: 3, max: 1000 })
    .withMessage("Review comment must be between 3 and 1000 characters"),
  validate,
];

export const deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID")
    .custom(async (val, { req }) => {
      if (req.user.role === "user") {
        const review = await Review.findById(val);
        if (!review) {
          throw new ApiError("Review not found", 404);
        }
        if (review.user.toString() !== req.user._id.toString()) {
          throw new ApiError(
            "You are not authorized to delete this review",
            403,
          );
        }
      }
      return true;
    }),
  validate,
];

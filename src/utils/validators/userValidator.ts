import { check } from "express-validator";
import { validate } from "../../middlewares/validator.middleware.ts";
import User from "../../models/user.model.ts";
import { ApiError } from "../apiError.ts";

export const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  validate,
];

export const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("User name must be between 3 and 100 characters"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val: string) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new ApiError("Email already exists", 400);
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be between 6 and 100 characters")
    .custom((password: string, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new ApiError("Password confirmation does not match", 400);
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required"),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number only Egyptian numbers supported")
    .custom(async (val: string) => {
      const user = await User.findOne({ phone: val });
      if (user) {
        throw new ApiError("Phone number already exists", 400);
      }
      return true;
    }),
  check("profileImage").optional(),
  check("role").optional(),
  validate,
];

export const updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  check("name").optional(),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val: string) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new ApiError("Email already exists", 400);
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number only Egyptian numbers supported")
    .custom(async (val: string) => {
      const user = await User.findOne({ phone: val });
      if (user) {
        throw new ApiError("Phone number already exists", 400);
      }
      return true;
    }),
  check("role").optional(),
  check("profileImage").optional(),
  validate,
];

export const changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be between 6 and 100 characters")
    .custom((password: string, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new ApiError("Password confirmation does not match", 400);
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required"),
  validate,
];

export const updateMyPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be between 6 and 100 characters")
    .custom((password: string, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new ApiError("Password confirmation does not match", 400);
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required"),
  validate,
];

export const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  validate,
];

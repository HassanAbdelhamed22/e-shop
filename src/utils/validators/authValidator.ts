import { check } from "express-validator";
import { validate } from "../../middlewares/validator.middleware.ts";
import User from "../../models/user.model.ts";
import { ApiError } from "../apiError.ts";

export const signupValidator = [
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
  validate,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be between 6 and 100 characters"),
  validate,
];

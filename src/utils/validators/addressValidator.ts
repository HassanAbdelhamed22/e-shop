import { check } from "express-validator";
import { validate } from "../../middlewares/validator.middleware.ts";

export const addToAddressValidator = [
  check("alias").notEmpty().withMessage("Address alias is required"),
  check("detailAddress").notEmpty().withMessage("Detail address is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("phoneNumber")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),
  check("postalCode").optional().notEmpty().withMessage("Postal code is required"),
  validate,
];

export const removeFromAddressValidator = [
  check("addressId").isMongoId().withMessage("Invalid Address ID"),
  validate,
];

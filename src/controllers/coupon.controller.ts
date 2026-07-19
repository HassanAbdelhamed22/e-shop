import Coupon from "../models/coupon.model.ts";
import * as controllerFactory from "./handlersFactory.ts";

// @desc    Get All Coupons
// @route   GET /api/v1/coupons
// @access  Private
export const getCoupons = controllerFactory.getAll(Coupon, "Coupon");

// @desc    Get Coupon By Id
// @route   GET /api/v1/coupons/:id
// @access  Private
export const getCouponById = controllerFactory.getOne(Coupon);

export const createCoupon = controllerFactory.createOne(Coupon);

// @desc    Update Coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private
export const updateCoupon = controllerFactory.updateOne(Coupon);

// @desc    Delete Coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private
export const deleteCoupon = controllerFactory.deleteOne(Coupon);

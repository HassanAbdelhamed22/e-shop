import Brand from "../models/brand.model.ts";
import * as controllerFactory from "./handlersFactory.ts";

// @desc    Get All Brands
// @route   GET /api/v1/brands
// @access  Public
export const getBrands = controllerFactory.getAll(Brand, "Brand");

// @desc    Get Brand By Id
// @route   GET /api/v1/brands/:id
// @access  Public
export const getBrandById = controllerFactory.getOne(Brand);

export const createBrand = controllerFactory.createOne(Brand);

// @desc    Update Brand
// @route   PUT /api/v1/brands/:id
// @access  Private
export const updateBrand = controllerFactory.updateOne(Brand);

// @desc    Delete Brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
export const deleteBrand = controllerFactory.deleteOne(Brand);

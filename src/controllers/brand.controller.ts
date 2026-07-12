import type { Request, Response } from "express";
import * as brandService from "../services/brand.service.ts";
import type { IBrand } from "../types/index.ts";
import { ApiError } from "../utils/apiError.ts";
import Brand from "../models/brand.model.ts";
import * as controllerFactory from "./handlersFactory.ts";

// @desc    Get All Brands
// @route   GET /api/v1/brands
// @access  Public
export const getBrands = async (req: Request, res: Response) => {
  const { brands, pagination } = await brandService.getBrands(req.query);

  res.status(200).json({
    success: true,
    data: { brands, pagination },
  });
};

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

import type { Request, Response } from "express";
import * as brandService from "../services/brand.service.ts";
import type { IBrand } from "../types/index.ts";
import { ApiError } from "../utils/apiError.ts";

// @desc    Get All Brands
// @route   GET /api/v1/brands
// @access  Public
export const getBrands = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const { brands, totalCount } = await brandService.getBrands(
    page,
    limit,
  );

  const totalPages = Math.ceil(totalCount / limit);

  const pagination = {
    currentPage: page,
    limit,
    totalPages,
    totalCount,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  res.status(200).json({
    success: true,
    data: { brands, pagination },
  });
};

// @desc    Get Brand By Id
// @route   GET /api/v1/brands/:id
// @access  Public
export const getBrandById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const brand = await brandService.getBrandById(id);
  if (!brand) {
    throw new ApiError("Brand not found", 404);
  }
  res.status(200).json({ success: true, data: { brand } });
};

// @desc    Create Brand
// @route   POST /api/v1/brands
// @access  Private
export const createBrand = async (req: Request, res: Response) => {
  const brandData: IBrand = req.body;
  const brand = await brandService.createBrand(brandData);
  res.status(201).json({ success: true, data: { brand } });
};

// @desc    Update Brand
// @route   PUT /api/v1/brands/:id
// @access  Private
export const updateBrand = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const brandData: Partial<IBrand> = req.body;
  const brand = await brandService.updateBrand(id, brandData);
  if (!brand) {
    throw new ApiError("Brand not found", 404);
  }
  res.status(200).json({ success: true, data: { brand } });
};

// @desc    Delete Brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
export const deleteBrand = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const brand = await brandService.deleteBrand(id);
  if (!brand) {
    throw new ApiError("Brand not found", 404);
  }
  res
    .status(200)
    .json({ success: true, message: "Brand deleted successfully" });
};

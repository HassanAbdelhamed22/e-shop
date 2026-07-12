import type { Request, Response } from "express";
import * as productService from "../services/product.service.ts";
import type { IProduct } from "../types/index.ts";
import { ApiError } from "../utils/apiError.ts";

// @desc    Get All Products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  // 1) Filter query parameters
  const queryObj = { ...req.query };
  const excludeFields = ["page", "limit", "sort", "fields", "keyword"];
  excludeFields.forEach((field) => delete queryObj[field]);

  // 2) Map operators (gte, gt, lte, lt) to mongoose query operators ($gte, $gt, $lte, $lt)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const filter = JSON.parse(queryStr);

  // Sorting
  const sort = req.query.sort;
  let sortBy = "createdAt";
  if (typeof sort === "string") {
    sortBy = sort.split(",").join(" ");
  }

  // Fields
  let fields = "";
  if (typeof req.query.fields === "string") {
    fields = req.query.fields.split(",").join(" ");
  }

  const { products, totalCount } = await productService.getProducts(
    page,
    limit,
    filter,
    sortBy,
    fields,
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
    data: { products, pagination },
  });
};

// @desc    Get Product By Id
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);
  if (!product) {
    throw new ApiError("Product not found", 404);
  }
  res.status(200).json({ success: true, data: { product } });
};

// @desc    Create Product
// @route   POST /api/v1/products
// @access  Private
export const createProduct = async (req: Request, res: Response) => {
  const productData: IProduct = req.body;
  const product = await productService.createProduct(productData);
  res.status(201).json({ success: true, data: { product } });
};

// @desc    Update Product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const productData: Partial<IProduct> = req.body;
  const product = await productService.updateProduct(id, productData);
  if (!product) {
    throw new ApiError("Product not found", 404);
  }
  res.status(200).json({ success: true, data: { product } });
};

// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const product = await productService.deleteProduct(id);
  if (!product) {
    throw new ApiError("Product not found", 404);
  }
  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
};

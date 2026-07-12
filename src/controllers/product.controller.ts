import type { Request, Response } from "express";
import * as productService from "../services/product.service.ts";
import type { IProduct } from "../types/index.ts";
import { ApiError } from "../utils/apiError.ts";
import Product from "../models/product.model.ts";
import * as controllerFactory from "./handlersFactory.ts";

// @desc    Get All Products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  const { products, pagination } = await productService.getProducts(req.query);

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
export const updateProduct = controllerFactory.updateOne(Product)

// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = controllerFactory.deleteOne(Product);

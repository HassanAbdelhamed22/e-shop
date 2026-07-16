import Product from "../models/product.model.ts";
import * as controllerFactory from "./handlersFactory.ts";
import {
  uploadMixOfImages,
  resizeProductImages,
} from "../middlewares/uploadImage.middleware.ts";

export const uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

export { resizeProductImages };

// @desc    Get All Products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = controllerFactory.getAll(Product, "Product", [
  { path: "category", select: "name" },
  { path: "subCategories", select: "name" },
  { path: "brand", select: "name" },
]);

// @desc    Get Product By Id
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductById = controllerFactory.getOne(Product, [
  { path: "category", select: "name" },
  { path: "subCategories", select: "name" },
  { path: "brand", select: "name" },
  { path: "reviews" },
]);

export const createProduct = controllerFactory.createOne(Product, [
  { path: "category", select: "name" },
  { path: "subCategories", select: "name" },
  { path: "brand", select: "name" },
]);

// @desc    Update Product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct = controllerFactory.updateOne(Product);

// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = controllerFactory.deleteOne(Product);

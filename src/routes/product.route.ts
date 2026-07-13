import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} from "../controllers/product.controller.ts";
import {
  createProductValidator,
  deleteProductValidator,
  getProductValidator,
  updateProductValidator,
} from "../utils/validators/productValidator.ts";

const router = Router();

router
  .route("/")
  .get(getProducts)
  .post(uploadProductImages, resizeProductImages, createProductValidator, createProduct);

router
  .route("/:id")
  .get(getProductValidator, getProductById)
  .put(uploadProductImages, resizeProductImages, updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

export default router;

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
import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";

const router = Router();

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    allowedTo("manager", "admin"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct,
  );

router
  .route("/:id")
  .get(getProductValidator, getProductById)
  .put(
    protect,
    allowedTo("manager", "admin"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);

export default router;

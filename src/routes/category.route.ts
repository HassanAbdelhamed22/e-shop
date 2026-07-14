import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  uploadCategoryImg,
  resizeImg,
} from "../controllers/category.controller.ts";
import {
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
} from "../utils/validators/categoryValidator.ts";
import subCategoryRouter from "./subCategory.route.ts";
import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";

const router = Router();

router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    allowedTo("manager", "admin"),
    uploadCategoryImg,
    createCategoryValidator,
    resizeImg,
    createCategory,
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategoryById)
  .put(
    protect,
    allowedTo("manager", "admin"),
    uploadCategoryImg,
    updateCategoryValidator,
    resizeImg,
    updateCategory,
  )
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, deleteCategory);

router.use("/:categoryId/subcategories", subCategoryRouter);

export default router;

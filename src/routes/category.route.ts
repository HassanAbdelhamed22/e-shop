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

const router = Router();

router
  .route("/")
  .get(getCategories)
  .post(
    protect,
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
    uploadCategoryImg,
    updateCategoryValidator,
    resizeImg,
    updateCategory,
  )
  .delete(deleteCategoryValidator, deleteCategory);

router.use("/:categoryId/subcategories", subCategoryRouter);

export default router;

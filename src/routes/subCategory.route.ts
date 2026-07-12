import { Router } from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategoriesByCategory,
  getSubCategoryById,
  setCategoryIdToBody,
  updateSubCategory,
} from "../controllers/subCategory.controller.ts";
import {
  createSubCategoryValidator,
  deleteSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
} from "../utils/validators/subCategoryValidator.ts";

// mergeParams: Allow to access params from parent router (category router)
const router = Router({ mergeParams: true });

router
  .route("/")
  .get(getSubCategories)
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategoryById)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategory);

export default router;

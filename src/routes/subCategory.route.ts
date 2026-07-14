import { Router } from "express";
import {
  createFilterObject,
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
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
import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";

// mergeParams: Allow to access params from parent router (category router)
const router = Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, getSubCategories)
  .post(
    protect,
    allowedTo("manager", "admin"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory,
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategoryById)
  .put(
    protect,
    allowedTo("manager", "admin"),
    updateSubCategoryValidator,
    updateSubCategory,
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory,
  );

export default router;

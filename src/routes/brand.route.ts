import { Router } from "express";
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  uploadBrandImg,
  resizeBrandImg,
} from "../controllers/brand.controller.ts";
import {
  createBrandValidator,
  deleteBrandValidator,
  getBrandValidator,
  updateBrandValidator,
} from "../utils/validators/brandValidator.ts";
import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";

const router = Router();

router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    allowedTo("manager", "admin"),
    uploadBrandImg,
    createBrandValidator,
    resizeBrandImg,
    createBrand,
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrandById)
  .put(
    protect,
    allowedTo("manager", "admin"),
    uploadBrandImg,
    updateBrandValidator,
    resizeBrandImg,
    updateBrand,
  )
  .delete(protect, allowedTo("admin"), deleteBrandValidator, deleteBrand);

export default router;

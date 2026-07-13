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

const router = Router();

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImg, createBrandValidator, resizeBrandImg, createBrand);

router
  .route("/:id")
  .get(getBrandValidator, getBrandById)
  .put(uploadBrandImg, updateBrandValidator, resizeBrandImg, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

export default router;

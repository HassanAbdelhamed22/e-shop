import { Router } from "express";
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
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
  .post(createBrandValidator, createBrand);

router
  .route("/:id")
  .get(getBrandValidator, getBrandById)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

export default router;

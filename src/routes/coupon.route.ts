import { Router } from "express";
import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller.ts";
import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";

const router = Router();

router.use(protect, allowedTo("manager", "admin"));

router.route("/").get(getCoupons).post(createCoupon);

router.route("/:id").get(getCouponById).put(updateCoupon).delete(deleteCoupon);

export default router;

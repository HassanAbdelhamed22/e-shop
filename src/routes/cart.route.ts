import { Router } from "express";
import {
  addProductToCart,
  clearLoggedUserCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  updateCartItemQuantity,
  applyCoupon,
} from "../controllers/cart.controller.ts";

import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";

const router = Router();

router.use(protect, allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearLoggedUserCart);

router.route("/apply-coupon").put(applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

export default router;

import { Router } from "express";
import {
  addProductToCart,
  clearLoggedUserCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  updateCartItemQuantity,
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
router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

export default router;

import { Router } from "express";
import {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
} from "../controllers/cart.controller.ts";

import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";

const router = Router();

router.use(protect, allowedTo("user"));

router.route("/").post(addProductToCart).get(getLoggedUserCart);
router.route("/:itemId").delete(removeSpecificCartItem);

export default router;

import { Router } from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../controllers/wishlist.controller.ts";
import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";
import {
  addProductToWishlistValidator,
  removeProductFromWishlistValidator,
} from "../utils/validators/wishlistValidator.ts";

const router = Router();

router.use(protect, allowedTo("user"));

router
  .route("/")
  .post(addProductToWishlistValidator, addToWishlist)
  .get(getWishlist);

router.route("/:productId").delete(removeProductFromWishlistValidator, removeFromWishlist);

export default router;

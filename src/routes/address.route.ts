import { Router } from "express";
import {
  addToAddress,
  removeFromAddress,
  getAddress,
} from "../controllers/address.controller.ts";
import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";
import {
  addToAddressValidator,
  removeFromAddressValidator,
} from "../utils/validators/addressValidator.ts";

const router = Router();

router.use(protect, allowedTo("user"));

router.route("/").post(addToAddressValidator, addToAddress).get(getAddress);

router
  .route("/:addressId")
  .delete(removeFromAddressValidator, removeFromAddress);

export default router;

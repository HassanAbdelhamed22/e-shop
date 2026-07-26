import { Router } from "express";
import {
  createCashOrder,
  filterOrderForloggedUser,
  getAllOrders,
  getSpecificOrder,
} from "../controllers/order.controller.ts";

import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";

const router = Router();

router.use(protect);

router.route("/:cartId").post(allowedTo("user"), createCashOrder);

router
  .route("/")
  .get(
    allowedTo("user", "admin", "manager"),
    filterOrderForloggedUser,
    getAllOrders,
  );

router
  .route("/:id")
  .get(allowedTo("user", "admin", "manager"), getSpecificOrder);

export default router;

import { Router } from "express";
import { createCashOrder } from "../controllers/order.controller.ts";

import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";

const router = Router();

router.use(protect, allowedTo("user"));

router.route("/:cartId").post(createCashOrder);

export default router;

import { Router } from "express";
import express from "express";
import {
  createCashOrder,
  filterOrderForloggedUser,
  getAllOrders,
  getSpecificOrder,
  getStripeSession,
  updateOrderDeliverStatus,
  updateOrderPaidStatus,
  updateOrderStatus,
  webhookCheckout,
  getSuccessPage,
  getCancelPage,
} from "../controllers/order.controller.ts";

import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";

const router = Router();

// Public routes (No authentication needed)
router.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);
router.get("/success", getSuccessPage);
router.get("/cancel", getCancelPage);

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

router
  .route("/:id/status")
  .put(allowedTo("admin", "manager"), updateOrderStatus);

router
  .route("/:id/deliver")
  .put(allowedTo("admin", "manager"), updateOrderDeliverStatus);

router
  .route("/:id/pay")
  .put(allowedTo("admin", "manager"), updateOrderPaidStatus);

router
  .route("/:cartId/checkout-session")
  .get(allowedTo("user"), getStripeSession);

export default router;

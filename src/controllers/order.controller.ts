import type { NextFunction, Request, Response } from "express";
import { cartModel } from "../models/cart.model.ts";
import { ApiError } from "../utils/apiError.ts";
import Order from "../models/order.model.ts";
import Product from "../models/product.model.ts";
import * as controllerFactory from "./handlersFactory.ts";
import "../types/index.ts";

/**
 * @desc    Create cash order
 * @route   POST /api/v1/orders/:cartId
 * @access  Private
 */
export const createCashOrder = async (req: Request, res: Response) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1- Get cart depend on cartId
  const cart = await cartModel.findById(req.params.cartId);

  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }

  // 2- Get order price depend on cart price "check if coupon applied"
  const orderPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;

  if (!orderPrice) {
    throw new ApiError("Cart is empty", 400);
  }

  const totalOrderPrice = orderPrice + taxPrice + shippingPrice;

  // 3- Create order with default payment method "cash"
  const order = await Order.create({
    user: req?.user?._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  // 4- Decrement product quantity, and increment sold field
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product },
          update: {
            $inc: {
              quantity: -item.quantity,
              sold: item.quantity,
            },
          },
        },
      };
    });

    await Product.bulkWrite(bulkOptions);

    // 5- Clear user cart
    await cartModel.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
};

// @desc Filter orders for logged user
export const filterOrderForloggedUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role === "user") {
    req.filterObject = { user: req.user._id };
  }
  next();
};

/**
 * @desc    Get all orders
 * @route   GET /api/v1/orders
 * @access  Private
 */
export const getAllOrders = controllerFactory.getAll(Order, "Order");

/**
 * @desc    Get Specific Order
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
export const getSpecificOrder = controllerFactory.getOne(Order);

/**
 * @desc    Update Order Deliver Status to Delivered
 * @route   PUT /api/v1/orders/:id/deliver
 * @access  Private/Admin-Manager
 */
export const updateOrderDeliverStatus = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  if (order.orderStatus === "delivered" || order.isDelivered) {
    throw new ApiError("Order already delivered", 400);
  }

  if (order.orderStatus === "cancelled") {
    throw new ApiError("Cannot deliver a cancelled order", 400);
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();
  order.orderStatus = "delivered";

  // Auto-pay COD (Cash on Delivery) orders upon successful delivery
  if (order.paymentMethodType === "cash" && !order.isPaid) {
    order.isPaid = true;
    order.paidAt = new Date();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated to delivered successfully",
    data: order,
  });
};

/**
 * @desc    Update Order Payment Status to Paid
 * @route   PUT /api/v1/orders/:id/pay
 * @access  Private/Admin-Manager
 */
export const updateOrderPaidStatus = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  if (order.isPaid) {
    throw new ApiError("Order already paid", 400);
  }

  order.isPaid = true;
  order.paidAt = new Date();

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order payment status updated to paid successfully",
    data: order,
  });
};

/**
 * @desc    Update order status (processing, shipped, etc.)
 * @route   PUT /api/v1/orders/:id/status
 * @access  Private/Admin-Manager
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { orderStatus } = req.body;

  const validStatuses = ["pending", "processing", "shipped", "cancelled"];
  if (!validStatuses.includes(orderStatus)) {
    throw new ApiError(
      `Invalid order status. Allowed: ${validStatuses.join(", ")}`,
      400,
    );
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  if (order.isDelivered || order.orderStatus === "delivered") {
    throw new ApiError(
      "Cannot change status of an already delivered order",
      400,
    );
  }

  if (order.orderStatus === "cancelled") {
    throw new ApiError("Cannot change status of a cancelled order", 400);
  }

  order.orderStatus = orderStatus;
  await order.save();

  res.status(200).json({
    success: true,
    message: `Order status updated to ${orderStatus} successfully`,
    data: order,
  });
};

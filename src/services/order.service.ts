import type { Request } from "express";
import "../types/index.ts";
import { cartModel } from "../models/cart.model.ts";
import Order from "../models/order.model.ts";
import Product from "../models/product.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { sendEmail } from "../utils/sendEmail.ts";
import { getOrderReceiptTemplate } from "../utils/emailTemplate.ts";
import Stripe from "stripe";

let stripe: Stripe;

/**
 * @desc    Create cash order service
 */
export const createCashOrder = async (req: Request) => {
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

    // 6- Send receipt email
    try {
      await order.populate({
        path: "cartItems.product",
        select: "title price",
      });
      if (req.user?.email) {
        await sendOrderReceiptEmail(order, req.user.email);
      }
    } catch (err) {
      console.error("Failed to send order receipt email:", err);
    }
  }

  return order;
};

/**
 * @desc    Update order deliver status to delivered service
 */
export const updateOrderDeliverStatus = async (req: Request) => {
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

  return order;
};

/**
 * @desc    Update order payment status to paid service
 */
export const updateOrderPaidStatus = async (req: Request) => {
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

  return order;
};

/**
 * @desc    Update order status service
 */
export const updateOrderStatus = async (req: Request) => {
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

  return order;
};

/**
 * @desc    Get Stripe session to create Stripe checkout page service
 */
export const getStripeSession = async (req: Request) => {
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

  // 3- Create stripe session
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET!);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user?.name || "Customer Order",
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.BASE_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/orders/cancel`,
    customer_email: req.user?.email,
    client_reference_id: req.params.cartId as string,
    metadata: {
      city: req.body?.shippingAddress?.city || "",
      phone: req.body?.shippingAddress?.phone || "",
      address: req.body?.shippingAddress?.address || "",
      postalCode: req.body?.shippingAddress?.postalCode || "",
    },
  });

  return session;
};

/**
 * @desc    Send order receipt email to the customer
 */
export const sendOrderReceiptEmail = async (order: any, email: string) => {
  const emailHtml = getOrderReceiptTemplate(order);

  await sendEmail({
    to: email,
    subject: `Your receipt from E-Shop (Order #${order._id.toString().slice(-8).toUpperCase()})`,
    html: emailHtml,
  });
};

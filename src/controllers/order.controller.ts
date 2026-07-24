import type { Request, Response } from "express";
import { cartModel } from "../models/cart.model.ts";
import { ApiError } from "../utils/apiError.ts";
import Order from "../models/order.model.ts";
import Product from "../models/product.model.ts";

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

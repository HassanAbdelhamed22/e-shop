import type { Request } from "express";
import "../types/index.ts";
import { cartModel } from "../models/cart.model.ts";
import Product from "../models/product.model.ts";
import Coupon from "../models/coupon.model.ts";
import { ApiError } from "../utils/apiError.ts";

const calcTotalPrice = (cart: any) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item: any) => {
    totalPrice += item?.price * item?.quantity;
  });

  cart.totalCartPrice = totalPrice;
  cart.totalCartPriceAfterDiscount = undefined;

  return totalPrice;
};

export const addProductToCart = async (req: Request) => {
  const { productId, color } = req.body;
  const product = await Product.findById({ _id: productId });

  let cart = await cartModel.findOne({ user: req?.user?._id });

  if (!cart) {
    cart = await cartModel.create({
      user: req?.user?._id,
      cartItems: [
        {
          product: productId,
          price: product?.price,
          color,
        },
      ],
    });
  } else {
    const productExist = cart.cartItems.findIndex(
      (item) => item.product?.toString() === productId && item.color === color,
    );

    if (productExist !== -1) {
      const cartItem = cart.cartItems[productExist];
      cartItem.quantity += 1;
      cart.cartItems[productExist] = cartItem;
    } else {
      cart.cartItems.push({
        product: productId,
        price: product?.price,
        color,
      });
    }
  }

  calcTotalPrice(cart);
  await cart.save();

  return cart;
};

export const getLoggedUserCart = async (req: Request) => {
  const cart = await cartModel.findOne({ user: req?.user?._id });

  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }

  return cart;
};

export const removeSpecificCartItem = async (req: Request) => {
  const { itemId } = req.params;
  const cart = await cartModel.findOneAndUpdate(
    { user: req?.user?._id },
    {
      $pull: {
        cartItems: {
          _id: itemId,
        },
      },
    },
    { new: true },
  );

  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }

  calcTotalPrice(cart);
  await cart.save();

  return cart;
};

export const clearLoggedUserCart = async (req: Request) => {
  const cart = await cartModel.findOneAndDelete({ user: req?.user?._id });

  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }

  return cart;
};

export const updateCartItemQuantity = async (req: Request) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cart = await cartModel.findOne({ user: req?.user?._id });

  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId,
  );

  if (itemIndex === -1) {
    throw new ApiError("Cart item not found", 404);
  }

  const item = cart.cartItems[itemIndex];
  item.quantity = quantity;

  cart.cartItems[itemIndex] = item;

  calcTotalPrice(cart);
  await cart.save();

  return cart;
};

export const applyCoupon = async (req: Request) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    throw new ApiError("Coupon not found or expired", 404);
  }

  const cart = await cartModel.findOne({ user: req?.user?._id });

  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }

  const totalPrice = cart.totalCartPrice;

  if (totalPrice === undefined || totalPrice === null) {
    throw new ApiError("Cart total price is not defined", 400);
  }

  const priceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalCartPriceAfterDiscount = Number(priceAfterDiscount);
  await cart.save();

  return cart;
};

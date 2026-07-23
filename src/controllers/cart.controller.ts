import type { Request, Response } from "express";
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

/**
 * @desc    add product to cart
 * @route   POST /api/v1/cart
 * @access  Private
 */
export const addProductToCart = async (req: Request, res: Response) => {
  const { productId, color } = req.body;
  const product = await Product.findById({ _id: productId });

  // 1) Get Cart for logged user or Create Cart if not exist
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
    // product exists in cart, increment quantity
    const productExist = cart.cartItems.findIndex(
      (item) => item.product?.toString() === productId && item.color === color,
    );

    if (productExist !== -1) {
      const cartItem = cart.cartItems[productExist];
      cartItem.quantity += 1;
      cart.cartItems[productExist] = cartItem;
    } else {
      // product does not exist in cart, add new product to cart
      cart.cartItems.push({
        product: productId,
        price: product?.price,
        color,
      });
    }
  }

  // Calculate Total Cart Price
  calcTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    data: cart,
  });
};

/**
 * @desc    get logged user cart
 * @route   GET /api/v1/cart
 * @access  Private
 */
export const getLoggedUserCart = async (req: Request, res: Response) => {
  const cart = await cartModel.findOne({ user: req?.user?._id });

  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }

  res.status(200).json({
    success: true,
    numberOfItems: cart.cartItems.length,
    totalCartPrice: cart.totalCartPrice,
    data: cart,
  });
};

/**
 * @desc    remove specific cart item
 * @route   DELETE /api/v1/cart/:itemId
 * @access  Private
 */
export const removeSpecificCartItem = async (req: Request, res: Response) => {
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

  res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    data: cart,
  });
};

/**
 * @desc    clear logged user cart
 * @route   DELETE /api/v1/cart
 * @access  Private
 */
export const clearLoggedUserCart = async (req: Request, res: Response) => {
  const cart = await cartModel.findOneAndDelete({ user: req?.user?._id });

  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }

  res.status(204).json({
    success: true,
    message: "Cart cleared successfully",
  });
};

/**
 * @desc    update specific cart item quantity
 * @route   PUT /api/v1/cart/:itemId
 * @access  Private
 */
export const updateCartItemQuantity = async (req: Request, res: Response) => {
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

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cart,
  });
};

/**
 * @desc    Apply coupon on cart
 * @route   PUT /api/v1/cart/apply-coupon
 * @access  Private
 */
export const applyCoupon = async (req: Request, res: Response) => {
  //1- Get the coupon from the database
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  //2- Check if the coupon is valid
  if (!coupon) {
    throw new ApiError("Coupon not found or expired", 404);
  }

  //3- Get logged user cart to get total cart price
  const cart = await cartModel.findOne({ user: req?.user?._id });

  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }

  const totalPrice = cart.totalCartPrice;

  if (totalPrice === undefined || totalPrice === null) {
    throw new ApiError("Cart total price is not defined", 400);
  }

  // 4- calculate price after discount
  const priceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  // 5- save the price after discount in cart
  cart.totalCartPriceAfterDiscount = Number(priceAfterDiscount);

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    data: cart,
  });
};

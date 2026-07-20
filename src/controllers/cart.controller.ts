import type { Request, Response } from "express";
import { cartModel } from "../models/cart.model.ts";
import Product from "../models/product.model.ts";
import { ApiError } from "../utils/apiError.ts";

const calcTotalPrice = (cart: any) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item: any) => {
    totalPrice += item?.price * item?.quantity;
  });

  cart.totalCartPrice = totalPrice;

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

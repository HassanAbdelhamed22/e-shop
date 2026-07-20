import type { Request, Response } from "express";
import { cartModel } from "../models/cart.model.ts";
import Product from "../models/product.model.ts";

const calcTotalPrice = (cart: any) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item: any) => {
    totalPrice += item?.price * item?.quantity;
  });

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
  const totalPrice = calcTotalPrice(cart);
  cart.totalCartPrice = totalPrice;

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    data: cart,
  });
};

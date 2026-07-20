import type { Request, Response } from "express";
import { cartModel } from "../models/cart.model.ts";
import Product from "../models/product.model.ts";

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
    console.log("Cart exists");
  }

  // 2) Add product to cart
};

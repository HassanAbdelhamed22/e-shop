import type { Request, Response } from "express";
import * as cartService from "../services/cart.service.ts";

/**
 * @desc    add product to cart
 * @route   POST /api/v1/cart
 * @access  Private
 */
export const addProductToCart = async (req: Request, res: Response) => {
  const cart = await cartService.addProductToCart(req);

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
  const cart = await cartService.getLoggedUserCart(req);

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
  const cart = await cartService.removeSpecificCartItem(req);

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
  await cartService.clearLoggedUserCart(req);

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
  const cart = await cartService.updateCartItemQuantity(req);

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
  const cart = await cartService.applyCoupon(req);

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    data: cart,
  });
};

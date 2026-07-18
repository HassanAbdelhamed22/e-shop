import type { Request, Response, NextFunction } from "express";
import * as wishlistService from "../services/wishlist.service.ts";

/**
 * @desc    Add product to wishlist
 * @route   POST /api/v1/wishlist
 * @access  Private/User
 */
export const addToWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await wishlistService.addToWishlist(req);

  res.status(200).json({
    success: true,
    message: "Product added successfully to your wishlist.",
    data: user?.wishlist,
  });
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/v1/wishlist/:productId
 * @access  Private/User
 */
export const removeFromWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await wishlistService.removeFromWishlist(req);

  res.status(200).json({
    success: true,
    message: "Product removed successfully from your wishlist.",
    data: user?.wishlist,
  });
};

/**
 * @desc    Get logged in user wishlist
 * @route   GET /api/v1/wishlist
 * @access  Private/User
 */
export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await wishlistService.getWishlist(req);

  res.status(200).json({
    success: true,
    results: user?.wishlist?.length || 0,
    data: user?.wishlist,
  });
};

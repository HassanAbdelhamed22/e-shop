import { Request } from "express";
import User from "../models/user.model.ts";

export const addToWishlist = async (req: Request) => {
  const { productId } = req.params;
  const { _id: userId } = req.user!;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { wishlist: productId },
    },
    { new: true },
  ).populate("wishlist");
  return user;
};

export const removeFromWishlist = async (req: Request) => {
  const { productId } = req.params;
  const { _id: userId } = req.user!;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $pull: { wishlist: productId },
    },
    { new: true },
  ).populate("wishlist");
  return user;
};
export const getWishlist = async (req: Request) => {
  const { _id: userId } = req.user!;

  const user = await User.findById(userId).populate("wishlist");
  return user;
};

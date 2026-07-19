import type { Request } from "express";
import User from "../models/user.model.ts";

export const addToAddress = async (req: Request) => {
  const { _id: userId } = req.user!;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true },
  );
  return user;
};

export const removeFromAddress = async (req: Request) => {
  const { addressId } = req.params;
  const { _id: userId } = req.user!;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $pull: { addresses: { id: addressId } },
    },
    { new: true },
  );
  return user;
};

export const getAddress = async (req: Request) => {
  const { _id: userId } = req.user!;

  const user = await User.findById(userId);
  return user;
};

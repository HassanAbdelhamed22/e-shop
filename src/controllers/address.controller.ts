import type { Request, Response, NextFunction } from "express";
import * as addressService from "../services/address.service.ts";

/**
 * @desc    Add Address
 * @route   POST /api/v1/address
 * @access  Private/User
 */
export const addToAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await addressService.addToAddress(req);

  res.status(200).json({
    success: true,
    message: "Address added successfully to your address.",
    data: user?.addresses,
  });
};

/**
 * @desc    Remove Address
 * @route   DELETE /api/v1/address/:addressId
 * @access  Private/User
 */
export const removeFromAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await addressService.removeFromAddress(req);

  res.status(200).json({
    success: true,
    message: "Address removed successfully from your address.",
    data: user?.addresses,
  });
};

/**
 * @desc    Get logged in user Address
 * @route   GET /api/v1/address
 * @access  Private/User
 */
export const getAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await addressService.getAddress(req);

  res.status(200).json({
    success: true,
    results: user?.addresses?.length || 0,
    data: user?.addresses,
  });
};

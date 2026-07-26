import type { NextFunction, Request, Response } from "express";
import Order from "../models/order.model.ts";
import * as controllerFactory from "./handlersFactory.ts";
import * as orderService from "../services/order.service.ts";
import "../types/index.ts";

/**
 * @desc    Create cash order
 * @route   POST /api/v1/orders/:cartId
 * @access  Private
 */
export const createCashOrder = async (req: Request, res: Response) => {
  const order = await orderService.createCashOrder(req);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
};

// @desc Filter orders for logged user
export const filterOrderForloggedUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role === "user") {
    req.filterObject = { user: req.user._id };
  }
  next();
};

/**
 * @desc    Get all orders
 * @route   GET /api/v1/orders
 * @access  Private
 */
export const getAllOrders = controllerFactory.getAll(Order, "Order");

/**
 * @desc    Get Specific Order
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
export const getSpecificOrder = controllerFactory.getOne(Order);

/**
 * @desc    Update Order Deliver Status to Delivered
 * @route   PUT /api/v1/orders/:id/deliver
 * @access  Private/Admin-Manager
 */
export const updateOrderDeliverStatus = async (req: Request, res: Response) => {
  const order = await orderService.updateOrderDeliverStatus(req);

  res.status(200).json({
    success: true,
    message: "Order status updated to delivered successfully",
    data: order,
  });
};

/**
 * @desc    Update Order Payment Status to Paid
 * @route   PUT /api/v1/orders/:id/pay
 * @access  Private/Admin-Manager
 */
export const updateOrderPaidStatus = async (req: Request, res: Response) => {
  const order = await orderService.updateOrderPaidStatus(req);

  res.status(200).json({
    success: true,
    message: "Order payment status updated to paid successfully",
    data: order,
  });
};

/**
 * @desc    Update order status (processing, shipped, etc.)
 * @route   PUT /api/v1/orders/:id/status
 * @access  Private/Admin-Manager
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  const order = await orderService.updateOrderStatus(req);

  res.status(200).json({
    success: true,
    message: `Order status updated to ${order.orderStatus} successfully`,
    data: order,
  });
};

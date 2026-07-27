import type { IUser } from "../types/index.ts";

export const sanitizeUser = (user: IUser) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    phone: user.phone,
    createdAt: user.createdAt,
  };
};

export const sanitizeCart = (cart: any) => {
  if (!cart) return null;
  return {
    _id: cart._id,
    cartItems: (cart.cartItems || []).map((item: any) => ({
      product: item.product,
      quantity: item.quantity,
      color: item.color,
      price: item.price,
    })),
    totalCartPrice: cart.totalCartPrice,
    totalCartPriceAfterDiscount: cart.totalCartPriceAfterDiscount,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
};

export const sanitizeOrder = (order: any) => {
  if (!order) return null;
  return {
    _id: order._id,
    user: order.user,
    cartItems: (order.cartItems || []).map((item: any) => ({
      product: item.product,
      price: item.price,
      quantity: item.quantity,
      color: item.color,
    })),
    taxPrice: order.taxPrice,
    shippingAddress: order.shippingAddress,
    shippingPrice: order.shippingPrice,
    totalOrderPrice: order.totalOrderPrice,
    paymentMethodType: order.paymentMethodType,
    isPaid: order.isPaid,
    paidAt: order.paidAt,
    orderStatus: order.orderStatus,
    isDelivered: order.isDelivered,
    deliveredAt: order.deliveredAt,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

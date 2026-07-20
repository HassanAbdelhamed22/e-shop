import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    cartItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: {
      type: Number,
      required: true,
    },
    totalCartPriceAfterDiscount: {
      type: Number,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const cartModel = model("Cart", cartSchema);

import mongoose, { Model, Schema } from "mongoose";
import type { IUser } from "../types/index.ts";

interface Review {
  user: mongoose.Types.ObjectId | IUser;
  rating: number;
  title: string;
  comment: string;
  product: mongoose.Types.ObjectId;
}

const reviewSchema = new Schema<Review>(
  {
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    comment: {
      type: String,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true },
);

const Review: Model<Review> = mongoose.model<Review>("Review", reviewSchema);

export default Review;

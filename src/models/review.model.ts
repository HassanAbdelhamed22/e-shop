import mongoose, { Model, Schema } from "mongoose";
import type { IUser } from "../types/index.ts";
import Product from "./product.model.ts";

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

// populate user in response
reviewSchema.pre(/find/i, function (this: any) {
  this.populate("user", "name email profileImage");
});

interface ReviewModel extends Model<Review> {
  calculateAverageRatingsAndQuantity(
    productId: mongoose.Types.ObjectId,
  ): Promise<void>;
}

reviewSchema.statics.calculateAverageRatingsAndQuantity = async function (
  this: mongoose.Model<any>,
  productId: mongoose.Types.ObjectId,
) {
  const result = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        ratingsCount: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRating,
      ratingsQuantity: result[0].ratingsCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await (this.constructor as ReviewModel).calculateAverageRatingsAndQuantity(
    this.product as any,
  );
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await (doc.constructor as ReviewModel).calculateAverageRatingsAndQuantity(
      doc.product as any,
    );
  }
});

const Review = mongoose.model<Review, ReviewModel>("Review", reviewSchema);

export default Review;

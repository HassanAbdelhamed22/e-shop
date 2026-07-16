import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Product name is required"],
      minlength: [2, "Product name must be at least 2 characters long"],
      maxlength: [100, "Product name must be at most 100 characters long"],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: [true, "Product slug already exists"],
      required: [true, "Product slug is required"],
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [
        20,
        "Product description must be at least 20 characters long",
      ],
      maxlength: [
        2000,
        "Product description must be at most 2000 characters long",
      ],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Product quantity must be at least 0"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      min: [0, "Product price must be at least 0"],
    },
    priceAfterDiscount: {
      type: Number,
    },

    colors: [String],

    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },

    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating average must be at least 0"],
      max: [5, "Rating average must be at most 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    sizes: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.pre("validate", function (this: any) {
  if (this.title && (this.isModified("title") || this.isNew)) {
    this.slug = slugify(this.title, { lower: true });
  }
});

const setImageUrl = (doc: any) => {
  if (doc.imageCover && !doc.imageCover.startsWith("http")) {
    doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
  }
  if (doc.images && Array.isArray(doc.images)) {
    doc.images = doc.images.map((image: string) => {
      if (!image.startsWith("http")) {
        return `${process.env.BASE_URL}/products/${image}`;
      }
      return image;
    });
  }
};

// after find
productSchema.post("init", function (doc: any) {
  setImageUrl(doc);
});

// after save
productSchema.post("save", function (doc: any) {
  setImageUrl(doc);
});

// virtual populate reviews
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

const Product = mongoose.model("Product", productSchema);

export default Product;

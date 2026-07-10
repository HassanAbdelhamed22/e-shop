import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name already exists"],
      minlength: [3, "Category name must be at least 3 characters long"],
      maxlength: [100, "Category name must be at most 100 characters long"],
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: [true, "Category slug already exists"],
      lowercase: true,
    },
    description: {
      type: String,
      minlength: [10, "Category description must be at least 10 characters long"],
      maxlength: [1000, "Category description must be at most 1000 characters long"],
    },

  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;

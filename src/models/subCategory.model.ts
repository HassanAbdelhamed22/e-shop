import mongoose from "mongoose";
import slugify from "slugify";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Subcategory name is required"],
      unique: [true, "Subcategory name already exists"],
      minlength: [2, "Subcategory name must be at least 2 characters long"],
      maxlength: [100, "Subcategory name must be at most 100 characters long"],
    },
    slug: {
      type: String,
      required: [true, "Subcategory slug is required"],
      unique: [true, "Subcategory slug already exists"],
      lowercase: true,
    },
    description: {
      type: String,
      minlength: [
        10,
        "Subcategory description must be at least 10 characters long",
      ],
      maxlength: [
        1000,
        "Subcategory description must be at most 1000 characters long",
      ],
    },
    image: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must belong to a category"],
    },
  },
  { timestamps: true },
);

subCategorySchema.pre("validate", function (this: any) {
  if (this.name && (this.isModified("name") || this.isNew)) {
    this.slug = slugify(this.name, { lower: true });
  }
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;

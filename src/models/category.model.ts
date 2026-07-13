import mongoose from "mongoose";
import slugify from "slugify";

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
      minlength: [
        10,
        "Category description must be at least 10 characters long",
      ],
      maxlength: [
        1000,
        "Category description must be at most 1000 characters long",
      ],
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

categorySchema.pre("validate", function (this: any) {
  if (this.name && (this.isModified("name") || this.isNew)) {
    this.slug = slugify(this.name, { lower: true });
  }
});

// Return image base url + image name in response
const setImageUrl = (doc: any) => {
  if (doc.image && !doc.image.startsWith("http")) {
    doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
  }
};

// after find
categorySchema.post("init", function (doc: any) {
  setImageUrl(doc);
});

// after save and update
categorySchema.post("save", function (doc: any) {
  setImageUrl(doc);
});

const Category = mongoose.model("Category", categorySchema);

export default Category;

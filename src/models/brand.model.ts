import mongoose from "mongoose";
import slugify from "slugify";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name already exists"],
      minlength: [3, "Brand name must be at least 3 characters long"],
      maxlength: [100, "Brand name must be at most 100 characters long"],
    },
    slug: {
      type: String,
      required: [true, "Brand slug is required"],
      unique: [true, "Brand slug already exists"],
      lowercase: true,
    },
    description: {
      type: String,
      minlength: [10, "Brand description must be at least 10 characters long"],
      maxlength: [
        1000,
        "Brand description must be at most 1000 characters long",
      ],
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

brandSchema.pre("validate", function (this: any) {
  if (this.name && (this.isModified("name") || this.isNew)) {
    this.slug = slugify(this.name, { lower: true });
  }
});

// Return image base url + image name in response
const setImageUrl = (doc: any) => {
  if (doc.image && !doc.image.startsWith("http")) {
    doc.image = `${process.env.BASE_URL}/brands/${doc.image}`;
  }
};

// after find
brandSchema.post("init", function (doc: any) {
  setImageUrl(doc);
});

// after save and update
brandSchema.post("save", function (doc: any) {
  setImageUrl(doc);
});

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;

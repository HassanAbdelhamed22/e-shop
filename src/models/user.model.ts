import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import slugify from "slugify";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "User name is required"],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: [6, "User password must be at least 6 characters long"],
      select: false,
    },
    passwordChangedAt: Date,
    profileImage: String,
    phone: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.pre("validate", function (this: any) {
  if (this.name && (this.isModified("name") || this.isNew)) {
    this.slug = slugify(this.name, { lower: true });
  }
});

// Return image base url + image name in response
const setImageUrl = (doc: any) => {
  if (doc.profileImage && !doc.profileImage.startsWith("http")) {
    doc.profileImage = `${process.env.BASE_URL}/users/${doc.profileImage}`;
  }
};

// after find
userSchema.post("init", function (doc: any) {
  setImageUrl(doc);
});

// after save and update
userSchema.post("save", function (doc: any) {
  setImageUrl(doc);
});

const User = mongoose.model("User", userSchema);

export default User;

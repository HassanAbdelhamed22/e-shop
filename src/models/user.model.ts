import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import slugify from "slugify";
import type { IUser } from "../types/index.ts";

const userSchema = new mongoose.Schema<IUser>(
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
    passwordResetCode: String,
    passwordResetCodeExpires: Date,
    passwordResetCodeVerify: Boolean,
    profileImage: String,
    phone: String,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        alias: String,
        detailAddress: String,
        phoneNumber: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete (ret as any).password;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete (ret as any).password;
        return ret;
      },
    },
  },
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

userSchema.methods.isPasswordChangedAfter = function (
  this: any,
  JWTTimestamp: number,
): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;

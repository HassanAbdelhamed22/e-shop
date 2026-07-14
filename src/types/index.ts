import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      filterObject?: any;
      user?: IUser;
    }
  }
}

export interface ICategory {
  _id?: string | mongoose.Types.ObjectId;
  name: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
}

export interface ISubCategory {
  _id?: string | mongoose.Types.ObjectId;
  name: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  category: string | mongoose.Types.ObjectId;
}

export interface IBrand {
  _id?: string | mongoose.Types.ObjectId;
  name: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
}

export interface IProduct {
  _id?: string | mongoose.Types.ObjectId;
  title: string;
  slug?: string;
  description: string;
  quantity: number;
  sold?: number;
  price: number;
  priceAfterDiscount?: number | null;
  colors?: string[];
  imageCover: string;
  images?: string[];
  category: string | mongoose.Types.ObjectId;
  subCategories?: (string | mongoose.Types.ObjectId)[];
  brand?: string | mongoose.Types.ObjectId | null;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  sizes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  active?: boolean;
  profileImage?: string;
}

export interface IUser {
  _id?: string | mongoose.Types.ObjectId;
  name: string;
  slug?: string | null;
  email: string;
  password?: string;
  passwordChangedAt?: Date;
  passwordResetCode?: string;
  passwordResetCodeExpires?: Date;
  passwordResetCodeVerify?: boolean;
  profileImage?: string | null;
  phone?: string | null;
  role?: "user" | "manager" | "admin";
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isPasswordChangedAfter?: (JWTTimestamp: number) => boolean;
}
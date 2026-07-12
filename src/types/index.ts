import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      filterObject?: any;
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
  priceAfterDiscount?: number;
  colors?: string[];
  imageCover: string;
  images?: string[];
  category: string | mongoose.Types.ObjectId;
  subCategory?: (string | mongoose.Types.ObjectId)[];
  brand?: string | mongoose.Types.ObjectId;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  sizes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
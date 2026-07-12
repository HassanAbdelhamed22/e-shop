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
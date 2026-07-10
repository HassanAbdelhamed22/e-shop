import mongoose from "mongoose";

export interface ICategory {
  _id?: string | mongoose.Types.ObjectId;
  name: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
}


import Product from "../models/product.model.ts";
import type { IProduct } from "../types/index.ts";
import slugify from "slugify";

export const getProducts = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ products: IProduct[]; totalCount: number }> => {
  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    Product.find().skip(skip).limit(limit),
    Product.countDocuments(),
  ]);

  return { products, totalCount };
};

export const getProductById = async (
  id: string,
): Promise<IProduct | null> => {
  const product = await Product.findById(id);
  return product;
};

export const createProduct = async (
  productData: IProduct,
): Promise<IProduct> => {
  if (!productData.title) {
    throw new Error("Product title is required");
  }
  productData.slug = slugify(productData.title, { lower: true });
  const product = await Product.create(productData);
  return product;
};

export const updateProduct = async (
  id: string,
  productData: Partial<IProduct>,
): Promise<IProduct | null> => {
  if (productData.title) {
    productData.slug = slugify(productData.title, { lower: true });
  }
  const product = await Product.findByIdAndUpdate(id, productData, {
    returnDocument: "after",
    runValidators: true,
  });
  return product;
};

export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  const product = await Product.findByIdAndDelete(id);
  return product;
};

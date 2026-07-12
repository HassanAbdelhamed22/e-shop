import Product from "../models/product.model.ts";
import type { IProduct } from "../types/index.ts";
import slugify from "slugify";

export const getProducts = async (
  page: number = 1,
  limit: number = 10,
  filter: Record<string, any> = {},
  sort: string = "createdAt",
): Promise<{ products: IProduct[]; totalCount: number }> => {
  const skip = (page - 1) * limit;

  // Build query
  let mongooseQuery = Product.find(filter)
    .populate({ path: "category", select: "name" })
    .populate({ path: "subCategories", select: "name" })
    .populate({ path: "brand", select: "name" });

  // pagination
  mongooseQuery = mongooseQuery.skip(skip).limit(limit);

  // Sorting
  if (sort) {
    mongooseQuery = mongooseQuery.sort(sort);
  }

  // Execute Query
  const [products, totalCount] = await Promise.all([
    mongooseQuery,
    Product.countDocuments(filter),
  ]);

  return { products, totalCount };
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  const product = await Product.findById(id)
    .populate({ path: "category", select: "name" })
    .populate({ path: "subCategories", select: "name" })
    .populate({ path: "brand", select: "name" });
  return product;
};

export const createProduct = async (
  productData: IProduct,
): Promise<IProduct> => {
  if (!productData.title) {
    throw new Error("Product title is required");
  }
  productData.slug = slugify(productData.title, { lower: true });
  let product = await Product.create(productData);
  product = await product.populate([
    { path: "category", select: "name" },
    { path: "subCategories", select: "name" },
    { path: "brand", select: "name" },
  ]);
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
  })
    .populate({ path: "category", select: "name" })
    .populate({ path: "subCategories", select: "name" })
    .populate({ path: "brand", select: "name" });
  return product;
};

export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  const product = await Product.findByIdAndDelete(id);
  return product;
};

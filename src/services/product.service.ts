import Product from "../models/product.model.ts";
import type { IProduct } from "../types/index.ts";
import slugify from "slugify";
import { ApiFeatures } from "../utils/apiFeatures.ts";
import type { PaginationResult } from "../utils/apiFeatures.ts";

export const getProducts = async (
  queryString: any
): Promise<{ products: IProduct[]; pagination: PaginationResult }> => {
  // 1) Get the total documents matching the filters & search keyword (before paginating)
  const countFeatures = new ApiFeatures(Product.find(), queryString)
    .filter()
    .search("Product");

  const totalCount = await Product.countDocuments(countFeatures.mongooseQuery.getFilter());

  // 2) Build and execute the full query with pagination, sorting, search, and projection
  const apiFeatures = new ApiFeatures(Product.find(), queryString)
    .filter()
    .search("Product")
    .sort()
    .limitFields()
    .pagination(totalCount);

  // 3) Apply population on the query
  apiFeatures.mongooseQuery = apiFeatures.mongooseQuery
    .populate({ path: "category", select: "name" })
    .populate({ path: "subCategories", select: "name" })
    .populate({ path: "brand", select: "name" });

  const products = await apiFeatures.mongooseQuery;

  return { products, pagination: apiFeatures.paginationResult! };
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

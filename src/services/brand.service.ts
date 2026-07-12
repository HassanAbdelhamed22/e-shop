import Brand from "../models/brand.model.ts";
import type { IBrand } from "../types/index.ts";
import slugify from "slugify";
import { ApiFeatures } from "../utils/apiFeatures.ts";
import type { PaginationResult } from "../utils/apiFeatures.ts";

export const getBrands = async (
  queryString: any,
): Promise<{ brands: IBrand[]; pagination: PaginationResult }> => {
  const countFeatures = new ApiFeatures(Brand.find(), queryString)
    .filter()
    .search("Brand");

  const totalCount = await Brand.countDocuments(countFeatures.mongooseQuery.getFilter());

  const apiFeatures = new ApiFeatures(Brand.find(), queryString)
    .filter()
    .search("Brand")
    .sort()
    .limitFields()
    .pagination(totalCount);

  const brands = await apiFeatures.mongooseQuery;

  return { brands, pagination: apiFeatures.paginationResult! };
};

export const getBrandById = async (
  id: string,
): Promise<IBrand | null> => {
  const brand = await Brand.findById(id);
  return brand;
};

export const createBrand = async (
  brandData: IBrand,
): Promise<IBrand> => {
  if (!brandData.name) {
    throw new Error("Brand name is required");
  }
  brandData.slug = slugify(brandData.name, { lower: true });
  const brand = await Brand.create(brandData);
  return brand;
};

export const updateBrand = async (
  id: string,
  brandData: Partial<IBrand>,
): Promise<IBrand | null> => {
  if (brandData.name) {
    brandData.slug = slugify(brandData.name, { lower: true });
  }
  const brand = await Brand.findByIdAndUpdate(id, brandData, {
    returnDocument: "after",
    runValidators: true,
  });
  return brand;
};

export const deleteBrand = async (id: string): Promise<IBrand | null> => {
  const brand = await Brand.findByIdAndDelete(id);
  return brand;
};

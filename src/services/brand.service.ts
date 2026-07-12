import Brand from "../models/brand.model.ts";
import type { IBrand } from "../types/index.ts";
import slugify from "slugify";

export const getBrands = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ brands: IBrand[]; totalCount: number }> => {
  const skip = (page - 1) * limit;

  const [brands, totalCount] = await Promise.all([
    Brand.find().skip(skip).limit(limit),
    Brand.countDocuments(),
  ]);

  return { brands, totalCount };
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

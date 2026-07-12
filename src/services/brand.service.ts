import Brand from "../models/brand.model.ts";
import type { IBrand } from "../types/index.ts";
import { ApiFeatures } from "../utils/apiFeatures.ts";
import type { PaginationResult } from "../utils/apiFeatures.ts";

export const getBrands = async (
  queryString: any,
): Promise<{ brands: IBrand[]; pagination: PaginationResult }> => {
  const countFeatures = new ApiFeatures(Brand.find(), queryString)
    .filter()
    .search("Brand");

  const totalCount = await Brand.countDocuments(
    countFeatures.mongooseQuery.getFilter(),
  );

  const apiFeatures = new ApiFeatures(Brand.find(), queryString)
    .filter()
    .search("Brand")
    .sort()
    .limitFields()
    .pagination(totalCount);

  const brands = await apiFeatures.mongooseQuery;

  return { brands, pagination: apiFeatures.paginationResult! };
};

export const getBrandById = async (id: string): Promise<IBrand | null> => {
  const brand = await Brand.findById(id);
  return brand;
};

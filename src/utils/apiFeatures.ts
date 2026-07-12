import { Query } from "mongoose";

export interface PaginationResult {
  currentPage: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class ApiFeatures<T> {
  mongooseQuery: Query<T[], T>;
  queryString: any;
  paginationResult?: PaginationResult;

  constructor(mongooseQuery: Query<T[], T>, queryString: any) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter(): ApiFeatures<T> {
    // 1) Filter query parameters
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "limit", "sort", "fields", "keyword"];
    excludeFields.forEach((field) => delete queryObj[field]);

    // 2) Map operators (gte, gt, lte, lt) to mongoose query operators ($gte, $gt, $lte, $lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const filter = JSON.parse(queryStr);

    this.mongooseQuery = this.mongooseQuery.find(filter);
    return this;
  }

  sort(): ApiFeatures<T> {
    if (this.queryString.sort) {
      const sort = this.queryString.sort;
      let sortBy = "createdAt";
      if (typeof sort === "string") {
        sortBy = sort.split(",").join(" ");
      }

      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  limitFields(): ApiFeatures<T> {
    if (this.queryString.fields) {
      const fields = this.queryString.fields;
      let fieldsBy = "";
      if (typeof fields === "string") {
        fieldsBy = fields.split(",").join(" ");
      }

      this.mongooseQuery = this.mongooseQuery.select(fieldsBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  search(modelName?: string): ApiFeatures<T> {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword;
      const query: any = {};
      
      if (modelName === "Product") {
        query["$or"] = [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ];
      } else {
        // Categories, Brands, Subcategories use 'name' instead of 'title'
        query["$or"] = [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ];
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  pagination(countDocuments: number): ApiFeatures<T> {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPages = Math.ceil(countDocuments / limit);

    this.paginationResult = {
      currentPage: page,
      limit,
      totalPages,
      totalCount: countDocuments,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
}

import type { Request, Response } from "express";
import { ApiError } from "../utils/apiError.ts";
import { ApiFeatures } from "../utils/apiFeatures.ts";

export const getAll = (Model: any, modelName?: string, populateOpts?: any) => {
  return async (req: Request, res: Response) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }

    // 1) Get total count of matching documents
    const countFeatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .search(modelName);

    const totalCount = await Model.countDocuments(
      countFeatures.mongooseQuery.getFilter(),
    );

    // 2) Apply all query operations
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .search(modelName)
      .sort()
      .limitFields()
      .pagination(totalCount);

    // 3) Apply population if requested
    if (populateOpts) {
      apiFeatures.mongooseQuery =
        apiFeatures.mongooseQuery.populate(populateOpts);
    }

    const documents = await apiFeatures.mongooseQuery;

    res.status(200).json({
      success: true,
      results: documents.length,
      pagination: apiFeatures.paginationResult,
      data: documents,
    });
  };
};

export const getOne = (Model: any, populateOpts?: any) => {
  return async (req: Request, res: Response) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populateOpts) {
      query = query.populate(populateOpts);
    }
    const document = await query;
    if (!document) {
      throw new ApiError(
        `Not found ${Model.modelName} with this id ${id}`,
        404,
      );
    }
    res.status(200).json({
      success: true,
      data: document,
    });
  };
};

export const createOne = (Model: any, populateOpts?: any) => {
  return async (req: Request, res: Response) => {
    let document = await Model.create(req.body);
    if (populateOpts) {
      document = await document.populate(populateOpts);
    }
    res.status(201).json({
      success: true,
      data: document,
    });
  };
};

export const updateOne = (Model: any) => {
  return async (req: Request, res: Response) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      throw new ApiError(
        `Not found ${Model.modelName} with this id ${id}`,
        404,
      );
    }

    // Assign fields and save to trigger pre-save hooks
    Object.assign(document, req.body);
    await document.save();

    res.status(200).json({
      success: true,
      message: `${Model.modelName} updated successfully`,
      data: document,
    });
  };
};

export const deleteOne = (Model: any) => {
  return async (req: Request, res: Response) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      throw new ApiError(
        `Not found ${Model.modelName} with this id ${id}`,
        404,
      );
    }
    res.status(200).json({
      success: true,
      message: `${Model.modelName} deleted successfully`,
    });
  };
};

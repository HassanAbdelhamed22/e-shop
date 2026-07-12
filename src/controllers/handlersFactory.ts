import type { Request, Response } from "express";
import { ApiError } from "../utils/apiError.ts";

export const deleteOne = (Model: any) => {
  return async (req: Request, res: Response) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      throw new ApiError(`Not found ${Model.modelName} with this id ${id}`, 404);
    }
    res.status(200).json({ success: true, message: `${Model.modelName} deleted successfully` });
  };
};
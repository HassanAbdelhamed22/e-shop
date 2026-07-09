import type { Request, Response } from "express";
import * as categoryService from "../services/category.service.ts";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Category name is required" });
      return;
    }

    const category = await categoryService.createCategory({ name });
    res.status(201).json({ category });
  } catch (error: any) {
    console.error("Error in createCategory controller:", error);
    res.status(500).json({ message: error.message || "Error creating category" });
  }
};

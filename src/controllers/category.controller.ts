import type { Request, Response } from "express";
import * as categoryService from "../services/category.service.ts";
import type { ICategory } from "../types/index.ts";

export const createCategory = async (req: Request, res: Response) => {
  const categoryData: ICategory = req.body;
  const category = await categoryService.createCategory(categoryData);
  res.status(201).json({ success: true, data: { category } });
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = await categoryService.getCategories();
  res.status(200).json({ success: true, results: categories.length, data: { categories } });
};

export const getCategoryById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const category = await categoryService.getCategoryById(id);
  if (!category) {
    res.status(404).json({ success: false, message: "Category not found" });
    return;
  }
  res.status(200).json({ success: true, data: { category } });
};

export const updateCategory = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const categoryData: Partial<ICategory> = req.body;
  const category = await categoryService.updateCategory(id, categoryData);
  if (!category) {
    res.status(404).json({ success: false, message: "Category not found" });
    return;
  }
  res.status(200).json({ success: true, data: { category } });
};

export const deleteCategory = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const category = await categoryService.deleteCategory(id);
  if (!category) {
    res.status(404).json({ success: false, message: "Category not found" });
    return;
  }
  res.status(200).json({ success: true, message: "Category deleted successfully" });
};


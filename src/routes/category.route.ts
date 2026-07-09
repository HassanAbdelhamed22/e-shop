import { Router } from "express";
import { createCategory } from "../controllers/category.controller.ts";

const router = Router();

router.post("/", createCategory);

export default router;
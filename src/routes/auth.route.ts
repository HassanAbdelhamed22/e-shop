import { Router } from "express";
import { signup } from "../controllers/auth.controller.ts";
import { signupValidator } from "../utils/validators/authValidator.ts";

const router = Router();

router.post("/signup", signupValidator, signup);

export default router;

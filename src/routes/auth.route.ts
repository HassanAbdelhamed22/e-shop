import { Router } from "express";
import { login, signup } from "../controllers/auth.controller.ts";
import {
  loginValidator,
  signupValidator,
} from "../utils/validators/authValidator.ts";

const router = Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);

export default router;

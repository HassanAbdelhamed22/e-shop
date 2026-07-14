import { Router } from "express";
import {
  login,
  signup,
  forgotPassword,
} from "../controllers/auth.controller.ts";
import {
  loginValidator,
  signupValidator,
} from "../utils/validators/authValidator.ts";

const router = Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgot-password", forgotPassword);

export default router;

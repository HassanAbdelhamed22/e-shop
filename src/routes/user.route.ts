import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadUserImg,
  resizeUserImg,
  changeUserPassword,
  getMe,
  updateMyPassword,
} from "../controllers/user.controller.ts";
import {
  changeUserPasswordValidator,
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
  updateMyPasswordValidator,
} from "../utils/validators/userValidator.ts";
import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";

const router = Router();

// User routes
router.get("/me", protect, getMe);
router.put("/me/change-password", protect, updateMyPasswordValidator, updateMyPassword);

// Admin routes
router.use(protect, allowedTo("admin"));

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImg, resizeUserImg, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUserById)
  .put(uploadUserImg, resizeUserImg, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router
  .route("/:id/change-password")
  .put(changeUserPasswordValidator, changeUserPassword);

export default router;

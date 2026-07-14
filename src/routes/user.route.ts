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
} from "../controllers/user.controller.ts";
import {
  changeUserPasswordValidator,
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
} from "../utils/validators/userValidator.ts";
import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";

const router = Router();

router
  .route("/")
  .get(protect, allowedTo("admin"), getUsers)
  .post(
    protect,
    allowedTo("admin"),
    uploadUserImg,
    resizeUserImg,
    createUserValidator,
    createUser,
  );

router
  .route("/:id")
  .get(protect, allowedTo("admin"), getUserValidator, getUserById)
  .put(
    protect,
    allowedTo("admin"),
    uploadUserImg,
    resizeUserImg,
    updateUserValidator,
    updateUser,
  )
  .delete(protect, allowedTo("admin"), deleteUserValidator, deleteUser);

router
  .route("/:id/change-password")
  .put(protect, changeUserPasswordValidator, changeUserPassword);

export default router;

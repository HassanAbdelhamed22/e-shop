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

const router = Router();

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

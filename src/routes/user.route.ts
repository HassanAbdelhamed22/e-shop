import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadUserImg,
  resizeUserImg,
} from "../controllers/user.controller.ts";
// import {
//   createUserValidator,
//   deleteUserValidator,
//   getUserValidator,
//   updateUserValidator,
// } from "../utils/validators/userValidator.ts";

const router = Router();

router.route("/").get(getUsers).post(uploadUserImg, resizeUserImg, createUser);

router
  .route("/:id")
  .get(getUserById)
  .put(uploadUserImg, resizeUserImg, updateUser)
  .delete(deleteUser);

export default router;

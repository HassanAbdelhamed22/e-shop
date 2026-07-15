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
  updateMyProfile,
  deactivateAccount,
} from "../controllers/user.controller.ts";
import {
  changeUserPasswordValidator,
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
  updateMyPasswordValidator,
  updateMyProfileValidator,
} from "../utils/validators/userValidator.ts";
import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";

const router = Router();

router.use(protect);

router.get("/me", getMe);
router.put("/me/change-password", updateMyPasswordValidator, updateMyPassword);
router.put(
  "/me",
  uploadUserImg,
  resizeUserImg,
  updateMyProfileValidator,
  updateMyProfile,
);
router.delete("/me", deactivateAccount);

// Admin routes
router.use(allowedTo("admin"));

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

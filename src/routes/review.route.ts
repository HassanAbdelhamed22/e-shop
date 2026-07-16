import { Router } from "express";
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.ts";

import { protect } from "../middlewares/protect.middleware.ts";
import { allowedTo } from "../middlewares/allowedTo.middleware.ts";
import {
  createReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
  updateReviewValidator,
} from "../utils/validators/reviewValidator.ts";

const router = Router();

router
  .route("/")
  .get(getReviews)
  .post(protect, allowedTo("user"), createReviewValidator, createReview);

router
  .route("/:id")
  .get(getReviewValidator, getReviewById)
  .put(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview,
  );

export default router;

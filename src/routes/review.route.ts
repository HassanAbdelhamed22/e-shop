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

const router = Router();

router
  .route("/")
  .get(getReviews)
  .post(protect, allowedTo("user"), createReview);

router
  .route("/:id")
  .get(getReviewById)
  .put(protect, allowedTo("user"), updateReview)
  .delete(protect, allowedTo("user", "admin", "manager"), deleteReview);

export default router;

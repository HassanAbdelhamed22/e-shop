import Review from "../models/review.model.ts";
import * as controllerFactory from "./handlersFactory.ts";

// @desc    Get All Reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getReviews = controllerFactory.getAll(Review, "Review");

// @desc    Get Review By Id
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReviewById = controllerFactory.getOne(Review);

// @desc    Create Review
// @route   POST /api/v1/reviews
// @access  Private
export const createReview = controllerFactory.createOne(Review);

// @desc    Update Review
// @route   PUT /api/v1/reviews/:id
// @access  Private
export const updateReview = controllerFactory.updateOne(Review);

// @desc    Delete Review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReview = controllerFactory.deleteOne(Review);

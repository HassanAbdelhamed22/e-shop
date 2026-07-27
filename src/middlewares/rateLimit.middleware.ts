import { rateLimit } from "express-rate-limit";
import { ApiError } from "../utils/apiError.ts";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: "draft-7", // draft-6/draft-7: returns RateLimit-* headers
  legacyHeaders: false, // Hide deprecated X-RateLimit-* headers
  skip: (req) => req.originalUrl.includes("webhook"), // Skip rate limiting for webhooks
  message: {
    status: "fail",
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  handler: (req, res, next, options) => {
    throw new ApiError(
      typeof options.message === "string"
        ? options.message
        : (options.message as any).message ||
            "Too many requests from this IP, please try again after 15 minutes",
      429,
    );
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: "fail",
    message:
      "Too many login attempts from this IP, please try again after 15 minutes",
  },
  handler: (req, res, next, options) => {
    throw new ApiError(
      typeof options.message === "string"
        ? options.message
        : (options.message as any).message ||
            "Too many login attempts from this IP, please try again after 15 minutes",
      429,
    );
  },
});

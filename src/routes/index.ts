import authRouter from "./auth.route.ts";
import categoryRouter from "./category.route.ts";
import subCategoryRouter from "./subCategory.route.ts";
import brandRouter from "./brand.route.ts";
import productRouter from "./product.route.ts";
import userRouter from "./user.route.ts";
import reviewRouter from "./review.route.ts";
import wishlistRouter from "./wishlist.route.ts";
import addressRouter from "./address.route.ts";
import couponRouter from "./coupon.route.ts";
import type { Express } from "express";

// Routes
const mountRoutes = (app: Express) => {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subCategoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/addresses", addressRouter);
  app.use("/api/v1/coupons", couponRouter);
};

export default mountRoutes;

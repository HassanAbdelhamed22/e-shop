import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.ts";
import categoryRouter from "./routes/category.route.ts";
import subCategoryRouter from "./routes/subCategory.route.ts";
import brandRouter from "./routes/brand.route.ts";
import productRouter from "./routes/product.route.ts";
import userRouter from "./routes/user.route.ts";
import reviewRouter from "./routes/review.route.ts";
import { globalError } from "./middlewares/error.middleware.ts";
import { ApiError } from "./utils/apiError.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("query parser", "extended");

// Middlewares
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRouter);

// Handle invalid routes
app.all("/*splat", (req, res, next) => {
  next(new ApiError(`Route ${req.originalUrl} not found`, 404));
});

// Global Error Handling Middleware
app.use(globalError);

export default app;

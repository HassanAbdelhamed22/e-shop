import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import morgan from "morgan";
import { globalError } from "./middlewares/error.middleware.ts";
import { ApiError } from "./utils/apiError.ts";
import mountRoutes from "./routes/index.ts";
import cors from "cors";
import compression from "compression";
import hpp from "hpp";
import { limiter, authLimiter } from "./middlewares/rateLimit.middleware.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy headers if behind Nginx/Cloudflare/etc.
app.set("trust proxy", 1);

app.use(cors());

app.options("/*splat", cors());

app.use(compression());

app.set("query parser", "extended");

// Middlewares
app.use(
  express.json({
    limit: "20kb",
    verify: (req: any, res, buf) => {
      if (req.originalUrl.includes("webhook")) {
        req.rawBody = buf;
      }
    },
  }),
);

app.use(express.static(path.join(__dirname, "..", "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Apply rate limiting
app.use("/api", limiter);
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/forgot-password", authLimiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "priceAfterDiscount",
      "ratingsQuantity",
      "ratingsAverage",
      "sold",
      "quantity",
      "brand",
      "category",
      "subCategories",
      "colors",
      "sizes",
      "ratings",
      "createdAt",
      "updatedAt",
    ],
  }),
);

//Routes
mountRoutes(app);

// Handle invalid routes
app.all("/*splat", (req, res, next) => {
  next(new ApiError(`Route ${req.originalUrl} not found`, 404));
});

// Global Error Handling Middleware
app.use(globalError);

export default app;

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import morgan from "morgan";
import { globalError } from "./middlewares/error.middleware.ts";
import { ApiError } from "./utils/apiError.ts";
import mountRoutes from "./routes/index.ts";

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

//Routes
mountRoutes(app);

// Handle invalid routes
app.all("/*splat", (req, res, next) => {
  next(new ApiError(`Route ${req.originalUrl} not found`, 404));
});

// Global Error Handling Middleware
app.use(globalError);

export default app;

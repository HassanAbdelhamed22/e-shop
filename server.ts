import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./src/config/database.ts";
import categoryRouter from "./src/routes/category.route.ts";
import { globalError } from "./src/middlewares/error.middleware.ts";

dotenv.config({ path: "config.env" });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1/categories", categoryRouter);

// Global Error Handling Middleware
app.use(globalError);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`,
  );
});


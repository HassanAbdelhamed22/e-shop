import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./src/config/database.ts";
import Category from "./src/models/category.model.ts";
import { createCategory } from "./src/controllers/category.controller.ts";

dotenv.config({ path: "config.env" });

connectDB();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}



app.post("/", createCategory);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`,
  );
});

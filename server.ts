import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./src/config/database.ts";
import Category from "./src/models/category.model.ts";

dotenv.config({ path: "config.env" });

connectDB();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}



app.post("/", async (req, res) => {
  try {
    const name = req.body.name;
    const category = await Category.create({ name });
    res.status(201).json({ category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating category" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`,
  );
});

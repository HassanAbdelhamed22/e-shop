import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";

dotenv.config({ path: "config.env" });

const dbUri = process.env.MONGO_URI || process.env.MONGO_URL;

if (!dbUri) {
  console.error(
    "Error: MONGO_URI or MONGO_URL is not defined in the environment variables.",
  );
  process.exit(1);
}

// Connect to database
mongoose
  .connect(dbUri)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const categorySchema = new mongoose.Schema({
  name: String,
});

const Category = mongoose.model("Category", categorySchema);

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

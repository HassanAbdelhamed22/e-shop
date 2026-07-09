import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";

dotenv.config({ path: "config.env" });

const dbUri = process.env.MONGO_URI || process.env.MONGO_URL;

if (!dbUri) {
  console.error("Error: MONGO_URI or MONGO_URL is not defined in the environment variables.");
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

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`,
  );
});

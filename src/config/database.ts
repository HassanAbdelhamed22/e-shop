import mongoose from "mongoose";

export const connectDB = () => {
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
};
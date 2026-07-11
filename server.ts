// 1. Handle uncaught exceptions at the very top
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

import dotenv from "dotenv";
import app from "./src/app.ts";
import { connectDB } from "./src/config/database.ts";

dotenv.config({ path: "config.env" });

// 2. Connect to database
connectDB();

// 3. Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`,
  );
});

// 4. Handle unhandled rejections outside Express
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../../models/product.model.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../config.env") });

// Mimic Express query string parsing
// Case A: Express parsing query string using standard qs (extended = true)
const reqQueryExtended = {
  page: "1",
  price: { gte: "150" }
};

// Case B: Express parsing query string using querystring (extended = false / simple)
const reqQuerySimple = {
  page: "1",
  "price[gte]": "150"
};

const runTest = async (reqQuery: any, label: string) => {
  const queryObj = { ...reqQuery };
  const excludeFields = ["page", "limit", "sort", "fields", "keyword"];
  excludeFields.forEach((field) => delete queryObj[field]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const filter = JSON.parse(queryStr);

  console.log(`--- Test: ${label} ---`);
  console.log("Original query object:", reqQuery);
  console.log("Parsed filter object:", filter);

  try {
    const count = await Product.countDocuments(filter);
    console.log("Matched documents count:", count);
  } catch (err: any) {
    console.error("Query Error:", err.message);
  }
};

const main = async () => {
  await mongoose.connect(process.env.MONGO_URI || "");
  console.log("Connected to DB");

  await runTest(reqQueryExtended, "Extended Query Parser (Nested Object)");
  await runTest(reqQuerySimple, "Simple Query Parser (Flat Brackets)");

  process.exit(0);
};

main();

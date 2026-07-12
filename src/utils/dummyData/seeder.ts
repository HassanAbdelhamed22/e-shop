import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import "colors";
import { connectDB } from "../../config/database.ts";
import Category from "../../models/category.model.ts";
import SubCategory from "../../models/subCategory.model.ts";
import Brand from "../../models/brand.model.ts";
import Product from "../../models/product.model.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, "../../../config.env") });

// Connect to DB
connectDB();

// Read data
const categories = JSON.parse(
  fs.readFileSync(path.join(__dirname, "categories.json"), "utf8")
);
const subcategories = JSON.parse(
  fs.readFileSync(path.join(__dirname, "subcategories.json"), "utf8")
);
const brands = JSON.parse(
  fs.readFileSync(path.join(__dirname, "brands.json"), "utf8")
);
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "products.json"), "utf8")
);

// Insert data into DB
const insertData = async () => {
  try {
    await Product.deleteMany();
    await Brand.deleteMany();
    await SubCategory.deleteMany();
    await Category.deleteMany();

    await Category.create(categories);
    await SubCategory.create(subcategories);
    await Brand.create(brands);
    await Product.create(products);

    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Brand.deleteMany();
    await SubCategory.deleteMany();
    await Category.deleteMany();

    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}

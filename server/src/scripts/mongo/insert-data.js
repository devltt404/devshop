import fs from "fs/promises";
import mongoose from "mongoose";
import "../../db/connect.db.js";
import CategoryModel from "../../models/category.model.js";
import ProductModel from "../../models/product.model.js";
import SkuModel from "../../models/sku.model.js";

const BASE_DATA_PATH = "src/scripts/mongo/data/";

function transformProductData(productData) {
  return productData.map((product) => {
    product._id = new mongoose.Types.ObjectId(product._id.$oid);
    product.createdAt = new Date(product.createdAt.$date);
    product.updatedAt = new Date(product.updatedAt.$date);
    return product;
  });
}

function transformSkuData(skuData) {
  return skuData.map((sku) => {
    sku.productId = new mongoose.Types.ObjectId(sku.productId.$oid);
    sku.createdAt = new Date(sku.createdAt.$date);
    sku.updatedAt = new Date(sku.updatedAt.$date);
    return sku;
  });
}

async function importJSONData(JSONFilePath, model, transformFunc) {
  console.log(`Importing data to ${model.modelName}`);
  const fileContent = await fs.readFile(JSONFilePath, "utf-8");
  const data = JSON.parse(fileContent);

  const transformedData = transformFunc ? transformFunc(data) : data;

  await model.insertMany(transformedData);
  console.log(
    `Imported ${transformedData.length} documents to ${model.modelName}`
  );
}

async function insertData() {
  console.log("REMOVE ALL EXISTING DOCUMENTS");
  await Promise.all([
    CategoryModel.deleteMany({}),
    ProductModel.deleteMany({}),
    SkuModel.deleteMany({}),
  ]);

  console.log("START INSERT DATA");

  await Promise.all([
    importJSONData(BASE_DATA_PATH + "test.categories.json", CategoryModel),
    importJSONData(
      BASE_DATA_PATH + "test.products.json",
      ProductModel,
      transformProductData
    ),
    importJSONData(
      BASE_DATA_PATH + "test.skus.json",
      SkuModel,
      transformSkuData
    ),
  ]);

  console.log("FINISH INSERT DATA");
}

mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("Connected to MongoDB");
  insertData().then(() => {
    mongoose.connection.close();
  });
});

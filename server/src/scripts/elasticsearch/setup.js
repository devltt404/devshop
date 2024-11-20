/*
 * This script is used to setup Elasticsearch index and migrate products data from MongoDB to Elasticsearch
 */

import mongoose from "mongoose";
import { esClient } from "../../configs/elasticsearch.config.js";
import ProductModel from "../../models/product.model.js";
import SkuModel from "../../models/sku.model.js";

await mongoose.connect(process.env.DATABASE_URL);

const createProductsIndex = async () => {
  try {
    await esClient.indices.create({
      index: "products",
      body: {
        mappings: {
          properties: {
            name: { type: "text" },
            description: { type: "text" },
            avgRating: { type: "float" },
            numReviews: { type: "integer" },
            category: { type: "keyword" },
            numSold: { type: "integer" },
            minPrice: { type: "float" },
            maxPrice: { type: "float" },
            createdAt: { type: "date" },
          },
        },
      },
    });
    console.log("Product index created");
  } catch (err) {
    console.error("Error creating index:", err);
  }
};

const createProductDocs = async () => {
  console.log("Migrating products to Elasticsearch...");

  const products = await ProductModel.find({}).lean();
  console.log(`Start creating ${products.length} product documents`);

  products.forEach(async (product, i) => {
    try {
      console.log(`${i + 1}. Creating document for product ${product._id}`);

      const sku = await SkuModel.find({ productId: product._id }).lean();
      let minPrice = sku.reduce(
        (min, s) => (s.price < min ? s.price : min),
        Infinity
      );
      let maxPrice = sku.reduce(
        (max, s) => (s.price > max ? s.price : max),
        -Infinity
      );

      await esClient.index({
        index: "products",
        id: product._id,
        body: {
          name: product.name,
          description: product.description,
          avgRating: product.avgRating,
          numReviews: product.numReviews,
          category: product.category,
          numSold: product.numSold,
          minPrice,
          maxPrice,
          createdAt: product.createdAt,
        },
      });

      console.log(`Document created for product ${product._id}`);
    } catch (error) {
      console.error(
        `Error creating document for product ${product._id}:`,
        error
      );
    }
  });

  console.log(`Setup elastic search for ${products.length} products`);
};

const setup = async () => {
  await createProductsIndex();
  await createProductDocs();
};

setup().then(() => {
  mongoose.connection.close();
});

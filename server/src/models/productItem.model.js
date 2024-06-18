import mongoose from "mongoose";

const productItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
      index: true,
    },
    variationSelection: {
      type: Map,
      of: String,
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock can not be less than 0"],
    },
    numSold: {
      type: Number,
      default: 0,
      min: [0, "Number of sold items can not be less than 0"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    originalPrice: {
      type: Number,
      validator: {
        $gt: ["$price", "Original price must be greater than discounted price"],
      },
    },
  },
  {
    timestamps: true,
  }
);

const ProductItemModel = mongoose.model("Product_Item", productItemSchema);
export default ProductItemModel;

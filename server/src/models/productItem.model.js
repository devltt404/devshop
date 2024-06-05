import mongoose from "mongoose";

const productItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    variationSelection: [
      {
        code: {
          type: String,
          required: [true, "Variation code is required"],
          trim: true,
        },
        value: {
          type: String,
          required: [true, "Variation value is required"],
          trim: true,
        },
      },
    ],
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
    discountPercent: {
      type: Number,
      min: [0, "Discount percentage can not be less than 0"],
      max: [100, "Discount percentage can not be greater than 100"],
    },
  },
  {
    timestamps: true,
  }
);

const ProductItemModel = mongoose.model("ProductItem", productItemSchema);
export default ProductItemModel;

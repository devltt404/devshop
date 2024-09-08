import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const skuSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      // Generate a custom ID (xxxxxxx; x = 0-9)
      default: () => {
        const nanoid = customAlphabet("0123456789", 7);
        return nanoid();
      },
    },

    /*
    color = ["red", "green", "blue"]
    size = ["S", "M", "L"]

    red + M => variationIndex: [0, 1]
   */
    variationIndex: {
      type: [Number],
      default: [0],
    },
    price: {
      type: Number,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    // The product ID to which this SKU (variant) belongs
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const SkuModel = mongoose.model("sku", skuSchema);
export default SkuModel;

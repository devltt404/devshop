import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    items: [
      {
        type: {
          _id: false,
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
          },
          sku: {
            type: String,
            ref: "sku",
          },
          quantity: {
            type: Number,
            required: true,
            min: [1, "Product quantity must be at least 1"],
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;

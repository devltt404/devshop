import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    items: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductVariant",
          },
          quantity: {
            type: Number,
            required: true,
            min: [1, "Product quantity must be at least 1"],
          },
          _id: false,
        },
      ],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;

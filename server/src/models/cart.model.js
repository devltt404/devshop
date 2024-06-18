import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    items: [
      {
        type: {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product_Item",
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

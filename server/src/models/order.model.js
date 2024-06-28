import mongoose from "mongoose";
import ORDER from "../constants/order.constant.js";
import PAYMENT from "../constants/payment.constant.js";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        _id: false,
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product_Item",
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        variation: {
          type: String,
        },
      },
    ],
    price: {
      subtotal: {
        type: Number,
        required: true,
      },
      shipping: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    customerInfo: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
    },
    shippingAddress: {
      type: Map,
      of: String,
    },
    orderStatus: {
      type: String,
      enum: Object.values(ORDER.STATUS),
      default: ORDER.STATUS.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT.STATUS),
      default: PAYMENT.STATUS.PENDING,
    },
    paymentIntentId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", OrderSchema);
export default OrderModel;

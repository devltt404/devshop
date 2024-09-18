import mongoose from "mongoose";
import { ORDER } from "../constants/index.js";
import { AutoIncrement } from "../db/connect.db.js";

const OrderSchema = new mongoose.Schema(
  {
    _id: {
      _id: Number,
      name: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    items: [
      {
        _id: false,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        sku: {
          type: String,
          ref: "Sku",
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
        variationSelection: {
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
    paymentIntentId: {
      type: String,
      unique: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

// Auto increment order number starting from 10000
OrderSchema.plugin(AutoIncrement, { start_seq: 10000 });

const OrderModel = mongoose.model("Order", OrderSchema);
export default OrderModel;

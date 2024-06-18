import mongoose, { Schema } from "mongoose";

const productVariationGroupSchema = new Schema(
  {
    variations: [
      {
        _id: false,
        label: {
          type: String,
          required: [true, "Variation label is required"],
          trim: true,
        },
        code: {
          type: String,
          required: [true, "Variation code is required"],
          trim: true,
        },
        options: [
          {
            _id: false,
            value: {
              type: String,
              required: [true, "Option value is required"],
              trim: true,
            },
            image: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProductVariationGroupModel = mongoose.model(
  "Product_Variation_Group",
  productVariationGroupSchema
);

export default ProductVariationGroupModel;

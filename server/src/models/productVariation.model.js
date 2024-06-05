import mongoose, { Schema } from "mongoose";

const productVariationSchema = new Schema({
  label: {
    type: String,
    required: [true, "Variant label is required"],
    trim: true,
  },
  code: {
    type: String,
    required: [true, "Variant code is required"],
    trim: true,
  },
  options: [
    {
      value: {
        type: String,
        required: [true, "Option value is required"],
        trim: true,
      },
      images: [String],
    },
  ],
});

const ProductVariationModel = mongoose.model(
  "ProductVariation",
  productVariationSchema
);

export default ProductVariationModel;

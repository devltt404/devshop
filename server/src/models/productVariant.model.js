import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Variant name is required"],
      trim: true,
      minLength: [3, "Variant name can not be less than 3 characters"],
      maxLength: [50, "Variant name can not be greater than 50 characters"],
    },

    //Price after discount
    price: {
      type: Number,
      required: [true, "Variant price is required"],
    },
    //Price before discount
    originalPrice: {
      type: Number,
      validator: {
        $gt: ["$price", "Original price must be greater than discounted price"],
      },
    },

    discountedPercentage: {
      type: Number,
      min: [0, "Discounted percentage can not be less than 0"],
      max: [100, "Discounted percentage can not be greater than 100"],
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      min: [0, "Stock can not be less than 0"],
      required: [true, "Variant stock is required"],
    },
    numSold: {
      type: Number,
      default: 0,
      min: [0, "Number of sold items can not be less than 0"],
    },
  },
  {
    timestamps: true,
  }
);

productVariantSchema.pre("save", function (next) {
  if (
    this.isModified("originalPrice") ||
    (this.isModified("price") && this.originalPrice)
  ) {
    this.percentageDiscount = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }

  next();
});

const ProductVariantModel = mongoose.model(
  "ProductVariant",
  productVariantSchema
);
export default ProductVariantModel;

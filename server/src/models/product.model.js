import mongoose from "mongoose";
import slugify from "slugify";
import PRODUCT from "../constants/product.constant.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: [true, "Product name already exists"],
      minLength: [6, "Product name must be at least 6 characters long"],
      maxLength: [
        100,
        "Product name must not be more than 100 characters long",
      ],
    },
    type: {
      type: String,
      enum: Object.values(PRODUCT.TYPE),
      required: [true, "Product type is required"],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },

    variationGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product_Variation_Group",
    },
    defaultItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product_Item",
    },

    minPrice: {
      type: Number,
    },
    maxPrice: {
      type: Number,
      validator: {
        $gt: ["$minPrice", "Max price must be greater than min price"],
      },
    },

    details: {
      type: Map,
      of: String,
    },
    isOutOfStock: {
      type: Boolean,
      default: false,
    },

    avgRating: {
      type: Number,
      default: 0,
      min: [0, "Average rating can not be less than 0"],
      max: [5, "Average rating can not be greater than 5"],
    },
    numReviews: {
      type: Number,
      default: 0,
      min: [0, "Number of reviews can not be less than 0"],
    },

    categoryId: {
      type: String,
      ref: "Category",
      required: [true, "Product category is required"],
      index: true,
    },
    numSold: {
      type: Number,
      default: 0,
      min: [0, "Number of product sold can not be less than 0"],
    },

    crawlId: {
      type: String,
      unique: true,
      select: false,
    },

    //Fields for product without variations
    originalPrice: {
      type: Number,
      min: [0, "Original price can not be less than 0"],
    },
    price: {
      type: Number,
      min: [0, "Price can not be less than 0"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock can not be less than 0"],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

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

productSchema.index(
  { name: "text", description: "text" },
  {
    weights: { name: 20, description: 1 },
  }
);

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;

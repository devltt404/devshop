import mongoose from "mongoose";
import slugify from "slugify";

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
    variants: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant" }],
      default: [],
    },
    defaultVariant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
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
    reviews: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    numSold: {
      type: Number,
      default: 0,
      min: [0, "Number of products sold can not be less than 0"],
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

import mongoose from "mongoose";
import slugify from "slugify";

const variationOptionSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

const variationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    options: [variationOptionSchema],
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: [true, "Product name already exists"],
      minLength: [6, "Product name must be at least 6 characters long"],
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
    },
    details: {
      type: Map,
      of: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: [0, "Average rating can not be less than 0"],
      max: [5, "Average rating can not be greater than 5"],
      set: (val) => Math.round(val * 10) / 10, // Round to 1 decimal place. E.g. 4.6667 => 4.7
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    variations: [variationSchema],
    category: {
      type: String,
      ref: "Category",
      required: true,
      index: true,
    },
    numSold: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
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

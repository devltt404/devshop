import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      // Generate a custom ID (cat-xxxxx; x = 0-9)
      default: () => {
        return customAlphabet("0123456789", 5);
      },
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
    },
    // Using materialized path to store the hierarchy of categories (,parentCategoryID,subCategoryID,subSubCategoryID,...)
    path: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;

import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
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
    icon: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
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

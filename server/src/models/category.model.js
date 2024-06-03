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
    description: {
      type: String,
      trim: true,
    },
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

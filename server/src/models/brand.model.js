import mongoose from "mongoose";
import slugify from "slugify";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

brandSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const brandModel = mongoose.model("Brand", brandSchema);
export default brandModel;

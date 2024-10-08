import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sku: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sku",
      required: true,
    },
    comment: {
      type: String,
      required: [true, "Review content is required"],
    },
    ratingValue: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating can not be less than 1"],
      max: [5, "Rating can not be more than 5"],
    },
  },
  {
    timestamps: true,
  }
);

const ReviewModel = mongoose.model("Review", reviewSchema);
export default ReviewModel;

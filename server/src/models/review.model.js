import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },
    reviewContent: {
      type: String,
      required: [true, "Review content is required"],
    },
    rating: {
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

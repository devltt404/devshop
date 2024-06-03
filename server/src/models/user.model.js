import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import USER from "../constants/user.constant.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters long"],
      maxLength: [50, "Name must not be more than 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: [true, "Email already exists"],
      trim: true,
      validate: {
        validator: function (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      trim: true,
    },
    picture: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    role: {
      type: String,
      enum: Object.values(USER.ROLE),
      default: USER.ROLE.CUSTOMER,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    orders: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
      ],
      default: [],
    },
    provider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;

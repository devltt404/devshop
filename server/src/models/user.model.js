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
      minLength: [6, "Password must be at least 6 characters long"],
      trim: true,
    },
    picture: {
      type: String,
      default: "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg",
    },
    role: {
      type: String,
      enum: Object.values(USER.ROLE),
      default: USER.ROLE.CUSTOMER,
    },
  },
  {
    timestamps: true,
  }
);

//Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;

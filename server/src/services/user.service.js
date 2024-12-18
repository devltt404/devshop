import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import UserModel from "../models/user.model.js";
import { deleteUploadByPath } from "../utils/cloudinary.util.js";

const profileSelect = "name email picture";

export default class UserService {
  static async findUserById({ lean = true, userId, select = profileSelect }) {
    return await UserModel.findById(userId).select(select).lean(lean);
  }

  static async findUserByEmail({ lean = true, email, select = profileSelect }) {
    return await UserModel.findOne({ email }).select(select).lean(lean);
  }

  static async createUser(userData) {
    return await UserModel.create(userData);
  }

  static async validateUser({ userId, select = profileSelect, lean = false }) {
    const user = await UserModel.findById(userId).select(select).lean(lean);
    if (!user) {
      throw new ErrorResponse(ERROR.USER.INVALID_USER);
    }

    return user;
  }

  static async getUserProfile({ userId }) {
    return { profile: await this.validateUser({ userId }) };
  }

  static async updateUserProfile({ userId, updateData }) {
    const user = await this.validateUser({ userId });

    // Check if email already exists
    if (updateData.email) {
      const existingUser = await UserModel.findOne({
        email: updateData.email,
      }).lean();

      if (existingUser) {
        throw new ErrorResponse(ERROR.USER.EMAIL_ALREADY_EXISTS);
      } else {
        user.email = updateData.email;
      }
    }

    // Only update basic fields
    if (updateData.name) user.name = updateData.name;

    return { profile: await user.save() };
  }

  static async updateUserPicture({ newPicturePath, userId }) {
    const user = await this.validateUser({ userId });
    if (!user) {
      throw new ErrorResponse(ERROR.USER.INVALID_USER);
    }

    const oldPicturePath = user.picture; // use to delete old picture after updating

    user.picture = newPicturePath;
    await user.save();

    if (oldPicturePath) deleteUploadByPath(oldPicturePath);

    return { picture: user.picture };
  }
}

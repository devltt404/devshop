import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import UserModel from "../models/user.model.js";
import { checkMissingFields } from "../utils/helper.util.js";

const profileSelect = "name email picture";

export default class UserService {
  //#region QUERY
  static async findUserById({ lean = true, userId, select = profileSelect }) {
    return await UserModel.findById(userId).select(select).lean(lean);
  }

  static async findUserByEmail({ lean = true, email, select = profileSelect }) {
    return await UserModel.findOne({ email }).select(select).lean(lean);
  }

  static async createUser(userData) {
    return await UserModel.create(userData);
  }
  //#endregion QUERY

  // #region BUSINESS LOGIC
  static async getUserProfile({ userId }) {
    const user = await UserModel.findById(userId).select(profileSelect).lean();
    if (!user) {
      throw new ErrorResponse(ERROR.USER.USER_NOT_FOUND);
    }
    return { profile: user };
  }

  static async updateUserProfile({ userId, updateData }) {
    checkMissingFields({ updateData });

    const user = await UserModel.findById(userId).select(profileSelect);
    if (!user) {
      throw new ErrorResponse(ERROR.USER.USER_NOT_FOUND);
    }

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
    if (updateData.picture) user.picutre = updateData.picture;
    if (updateData.name) user.name = updateData.name;

    return { profile: await user.save() };
  }
  // #endregion
}

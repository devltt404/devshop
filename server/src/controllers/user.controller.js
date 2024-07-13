import { SuccessResponse } from "../core/response.js";
import UserService from "../services/user.service.js";

export default class UserController {
  static async getUserProfile(req, res) {
    new SuccessResponse({
      message: "User profile fetched successfully",
      metadata: await UserService.getUserProfile({
        userId: req.user?._id,
      }),
    }).send(res);
  }

  static async updateUserProfile(req, res) {
    new SuccessResponse({
      message: "User profile updated successfully",
      metadata: await UserService.updateUserProfile({
        userId: req.user?._id,
        updateData: req.body,
      }),
    }).send(res);
  }

  static async updateUserPicture(req, res) {
    new SuccessResponse({
      message: "User picture updated successfully",
      metadata: await UserService.updateUserPicture({
        newPicturePath: req.file?.path,
        userId: req.user?._id,
      }),
    }).send(res);
  }
}

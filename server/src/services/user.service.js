import UserModel from "../models/user.model.js";

export default class UserService {
  //#region QUERY

  /**
   * Retrieves the user based on the given id.
   * @param {Object} options - The options for getting the user.
   * @param {string} options.id - The ID of the user.
   * @param {boolean} [options.lean=true] - The flag to return plain JSON object.
   * @returns {Promise<Array>} A promise that resolves to the user with given id.
   */
  static async findUserById({ lean = true, userId, select = "_id" }) {
    return await UserModel.findById(userId).select(select).lean(lean);
  }

  /**
   * Retrieves a user from the database based on their email.
   *
   * @param {Object} options - The options for retrieving the user.
   * @param {boolean} [options.lean=true] - Whether to return a plain JavaScript object instead of a Mongoose document.
   * @param {string} options.email - The email of the user to retrieve.
   * @param {string} [options.select="-__v"] - The fields to include or exclude from the query result.
   * @returns {Promise<Object|null>} A promise that resolves to the user object if found, or null if not found.
   */
  static async findUserByEmail({ lean = true, email, select = "_id" }) {
    return await UserModel.findOne({ email }).select(select).lean(lean);
  }

  static async createUser(userData) {
    return await UserModel.create(userData);
  }
  //#endregion QUERY
}

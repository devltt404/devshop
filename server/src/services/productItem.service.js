import ProductItemModel from "../models/productItem.model.js";

export default class ProductItemService {
  // #region QUERY
  static async findProductItemById({ itemId, select, lean = true }) {
    return await ProductItemModel.findById(itemId)
      .select(select)
      .lean(lean);
  }

  // #endregion
}

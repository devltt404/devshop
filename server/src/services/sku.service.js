import SkuModel from "../models/sku.model.js";

export default class SkuService {
  // #region QUERIES
  static async findSkusByProductId({ productId, lean = true }) {
    return SkuModel.find({ productId }).lean(lean);
  }

  static async findSkuById({ skuId, lean = true }) {
    return SkuModel.findById(skuId).lean(lean);
  }
  // #endregion
}

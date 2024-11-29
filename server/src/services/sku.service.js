import SkuModel from "../models/sku.model.js";

export default class SkuService {
  static async findSkusByProductId({ productId, lean = true }) {
    return SkuModel.find({ productId }).lean(lean);
  }

  static async findSkuById({ skuId, lean = true, select = "" }) {
    return SkuModel.findById(skuId).select(select).lean(lean);
  }
}

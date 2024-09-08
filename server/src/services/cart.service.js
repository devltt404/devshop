import shopConfig from "../configs/shop.config.js";
import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import CartModel from "../models/cart.model.js";
import { clearCartCookie, setCartCookie } from "../utils/cart.util.js";
import { getVariationString } from "../utils/sku.util.js";
import ProductService from "./product.service.js";
import SkuService from "./sku.service.js";

export default class CartService {
  // #region QUERIES
  static async findCartByUserId({ userId, lean = true }) {
    return CartModel.findOne({ userId }).lean(lean);
  }

  static async updateCartOwner({ cartId, userId }) {
    return CartModel.findByIdAndUpdate(cartId, { userId });
  }

  static async deleteCartById({ cartId }) {
    return await CartModel.findByIdAndDelete(cartId);
  }

  // #endregion

  // #region HELPER
  static genFindCartQuery({ userId, guestCartId }) {
    return userId ? { userId } : { _id: guestCartId };
  }

  static async validateCartItem({ productId, skuId }) {
    //Validate product
    const product = await ProductService.findProductById({
      productId,
      select: "-description -details",
    });
    if (!product) throw new ErrorResponse(ERROR.CART.INVALID_PRODUCT_ID);

    //Validate sku
    const sku = await SkuService.findSkuById({ skuId });
    if (!sku) throw new ErrorResponse(ERROR.CART.INVALID_SKU_ID);

    return { product, sku };
  }
  //#endregion HELPER

  // #region BUSINESS LOGIC
  static async getSimpleCart({ userId, guestCartId, res }) {
    const cart = await CartModel.findOne(
      this.genFindCartQuery({ userId, guestCartId })
    ).lean();

    //Clear cart cookie if guest cart is not found
    if (!userId && guestCartId && !cart) {
      clearCartCookie(res);
    }

    let simpleCart = {
      numCartItems: cart?.items?.length || 0,
    };
    return simpleCart;
  }

  static async getCartDetail({ userId, guestCartId }) {
    const cart = await CartModel.findOne(
      this.genFindCartQuery({ userId, guestCartId })
    )
      .populate("items.product", "-description -details")
      .populate("items.sku");

    if (!cart) {
      throw new ErrorResponse(ERROR.CART.INVALID_CART);
    }

    let isAnItemExceedsStock = false;

    const items = cart.items.map((item) => {
      const { product, sku } = item;

      if (sku.stock < item.quantity) {
        item.quantity = sku.stock;
        stock = item.quantity;
        isAnItemExceedsStock = true;
      }

      return {
        productId: product._id,
        slug: product.slug,
        skuId: sku._id,
        quantity: quantity,
        name: product.name,
        price: sku.price,
        image: sku.images[0],
        stock: sku.stock,
        variationSelection: getVariationString({ product, sku }),
      };
    });

    if (isAnItemExceedsStock) {
      // Remove items that out of stock
      cart = cart.filter((item) => item.quantity > 0);

      await cart.save();
    }

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const shipping =
      subtotal >= shopConfig.freeShipThreshold ? 0 : shopConfig.shippingFee;

    return {
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  }

  static async addToCart({
    userId,
    productId,
    skuId,
    quantity,
    guestCartId,
    res,
  }) {
    if (quantity < 1) throw new ErrorResponse(ERROR.CART.INVALID_QUANTITY);

    const { product, sku } = await this.validateCartItem({
      productId,
      skuId,
    });

    let cart = await CartModel.findOne(
      this.genFindCartQuery({ userId, guestCartId })
    );

    if (!cart) {
      if (userId) {
        cart = new CartModel({ userId, items: [] });
      } else {
        cart = new CartModel({ items: [] });
        setCartCookie({ res, cartId: cart._id });
      }
    }

    const existingItem = cart.items.find((i) => {
      return i.product == product._id && i.sku == sku._id;
    });

    const newQuantity = existingItem?.quantity || 0 + quantity;
    if (newQuantity > sku.stock)
      throw new ErrorResponse(
        ERROR.CART.INSUFFICIENT_STOCK({ stock: sku.stock })
      );

    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product, sku, quantity });
    }

    await cart.save();
    return cart;
  }

  static async updateCartItemQuantity({
    userId,
    guestCartId,
    quantity,
    productId,
    skuId,
  }) {
    if (quantity < 1) throw new BadRequestError("Quantity must be at least 1.");
    const { sku } = await this.validateCartItem({ productId, skuId });

    if (quantity > sku.stock) {
      throw new ErrorResponse(
        ERROR.CART.INSUFFICIENT_STOCK({ stock: sku.stock })
      );
    }

    const updatedCart = await CartModel.findOneAndUpdate(
      {
        ...this.genFindCartQuery({ userId, guestCartId }),
        "items.product": productId,
        "items.sku": skuId,
      },
      {
        $set: {
          "items.$.quantity": quantity,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedCart) {
      throw new ErrorResponse(ERROR.CART.INVALID_CART);
    }
    return updatedCart;
  }

  static async removeCartItem({ userId, productId, skuId, guestCartId }) {
    await this.validateCartItem({ productId, skuId });

    const updatedCart = await CartModel.findOneAndUpdate(
      {
        ...this.genFindCartQuery({ userId, guestCartId }),
      },
      {
        $pull: {
          items: { productId, skuId },
        },
      },
      {
        new: true,
      }
    );
    
    if (!updatedCart) {
      throw new ErrorResponse(ERROR.CART.INVALID_CART);
    }
    return updatedCart;
  }

  static async clearCart({ userId, guestCartId, res }) {
    const cart = await CartModel.findOneAndUpdate(
      this.genFindCartQuery({ userId, guestCartId }),
      { items: [] },
      { new: true }
    );

    if (guestCartId) clearCartCookie(res);
    if (!cart) {
      throw new ErrorResponse(ERROR.CART.INVALID_CART);
    }
    return cart;
  }
  // #endregion
}

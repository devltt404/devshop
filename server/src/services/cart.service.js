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
  static async returnMutatedCart(cart) {
    return {
      cart,
      totalQuantity: await this.getTotalQuantity(cart),
    };
  }

  static async getTotalQuantity(cart) {
    return cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  }

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

  static async populateCart(cartQuery) {
    const cart = await cartQuery
      .populate("items.product", "-description -details -features")
      .populate("items.sku");

    if (!cart) {
      throw new ErrorResponse(ERROR.CART.INVALID_CART);
    }

    let isAnItemExceedsStock = false;

    const items = cart.items.map((item) => {
      const { product, sku } = item;

      if (sku.stock < item.quantity) {
        item.quantity = sku.stock;
        isAnItemExceedsStock = true;
      }

      return {
        product: product._id,
        slug: product.slug,
        sku: sku._id,
        quantity: item.quantity,
        name: product.name,
        price: sku.price,
        image: sku.images[0] || product.images[0],
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
      totalQuantity: this.getTotalQuantity(cart),
    };
    return simpleCart;
  }

  static async getCartDetail({ userId, guestCartId }) {
    const cart = await this.populateCart(
      CartModel.findOne(this.genFindCartQuery({ userId, guestCartId }))
    );

    return {
      cart,
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
    const {
      sku: { stock },
    } = await this.validateCartItem({
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

    const existingItem = cart.items.find((item) => {
      return item.product == productId && item.sku == skuId;
    });

    const newQuantity = (existingItem?.quantity || 0) + quantity;
    if (newQuantity > stock)
      throw new ErrorResponse(ERROR.CART.INSUFFICIENT_STOCK({ stock }));

    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, sku: skuId, quantity });
    }

    await cart.save();
    return this.returnMutatedCart(cart);
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

    const updatedCart = await this.populateCart(
      CartModel.findOneAndUpdate(
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
      )
    );

    return this.returnMutatedCart(updatedCart);
  }

  static async removeCartItem({ userId, productId, skuId, guestCartId }) {
    await this.validateCartItem({ productId, skuId });

    const updatedCart = await this.populateCart(
      CartModel.findOneAndUpdate(
        {
          ...this.genFindCartQuery({ userId, guestCartId }),
        },
        {
          $pull: {
            items: { product: productId, sku: skuId },
          },
        },
        {
          new: true,
        }
      )
    );

    return this.returnMutatedCart(updatedCart);
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
    return this.returnMutatedCart(cart);
  }
  // #endregion
}

import shopConfig from "../configs/shop.config.js";
import {PRODUCT} from "../constants/index.js";
import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import CartModel from "../models/cart.model.js";
import { clearCartCookie, setCartCookie } from "../utils/cart.util.js";
import ProductService from "./product.service.js";
import ProductItemService from "./productItem.service.js";

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

  static async validateProductAndItem({ productId, itemId }) {
    //Validate product
    const product = await ProductService.findProductById({
      productId,
      select: "-description -details",
    });
    if (!product) throw new ErrorResponse(ERROR.CART.INVALID_PRODUCT_ID);

    //Validate item
    let item;
    if (product.type === PRODUCT.TYPE.CONFIGURABLE) {
      item = await ProductItemService.findProductItemById({ itemId });
      if (!item) throw new ErrorResponse(ERROR.CART.INVALID_ITEM_ID);
    }
    return { product, item };
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
      .populate("items.productId", "-description -details")
      .populate("items.itemId");

    if (!cart) {
      throw new ErrorResponse(ERROR.CART.INVALID_CART);
    }

    let isAnItemExceedsStock = false;

    const items = cart.items.map((cartItem) => {
      let stock =
        cartItem.productId.type === PRODUCT.TYPE.CONFIGURABLE
          ? cartItem.itemId.stock
          : cartItem.productId.stock;

      if (stock < cartItem.quantity) {
        cartItem.quantity = stock;
        stock = cartItem.quantity;
        isAnItemExceedsStock = true;
      }

      return {
        productId: cartItem.productId._id,
        slug: cartItem.productId.slug,
        type: cartItem.productId.type,
        itemId: cartItem.itemId?._id,
        quantity: cartItem.quantity,
        name: cartItem.productId.name,
        price:
          cartItem.productId.type === PRODUCT.TYPE.CONFIGURABLE
            ? cartItem.itemId.price
            : cartItem.productId.price,
        image:
          cartItem.productId.type === PRODUCT.TYPE.CONFIGURABLE
            ? cartItem.itemId.images[0]
            : cartItem.productId.images[0],
        stock,
        variationSelection: cartItem.itemId?.variationSelection,
      };
    });

    if (isAnItemExceedsStock) {
      await cart.save();
    }

    const subtotal = parseFloat(
      items
        .reduce((acc, item) => acc + item.price * item.quantity, 0)
        .toFixed(2)
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
    itemId,
    quantity,
    guestCartId,
    res,
  }) {
    if (quantity < 1) throw new ErrorResponse(ERROR.CART.INVALID_QUANTITY);

    const { product, item } = await this.validateProductAndItem({
      productId,
      itemId,
    });

    let cart;
    if (userId) {
      cart = await CartModel.findOne({ userId });

      if (!cart) {
        cart = new CartModel({ userId, items: [] });
      }
    } else {
      cart = await CartModel.findById(guestCartId);

      if (!cart) {
        cart = new CartModel({ items: [] });
        setCartCookie({ cartId: cart._id, res });
      }
    }

    const existingItem = cart.items.find((i) => {
      if (i.itemId) return i.productId == productId && i.itemId == itemId;
      return i.productId == productId;
    });

    //Validate quantity
    const availableQty =
      product.type === PRODUCT.TYPE.CONFIGURABLE ? item.stock : product.stock;
    const existingQty = existingItem?.quantity || 0;

    if (existingQty > availableQty) {
      existingItem.quantity = availableQty;
    }

    const newQuantity = existingQty + quantity;
    if (newQuantity > availableQty)
      throw new ErrorResponse(
        ERROR.CART.INSUFFICIENT_STOCK({ availableQty, existingQty })
      );

    //Update cart
    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ productId, itemId, quantity });
    }

    await cart.save();
    return cart;
  }

  static async updateCartItemQuantity({
    userId,
    guestCartId,
    quantity,
    productId,
    itemId,
  }) {
    if (quantity < 1) throw new BadRequestError("Quantity must be at least 1.");
    await this.validateProductAndItem({ productId, itemId });
    const updatedCart = await CartModel.findOneAndUpdate(
      {
        ...this.genFindCartQuery({ userId, guestCartId }),
        "items.productId": productId,
        "items.itemId": itemId,
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

  static async removeCartItem({ userId, productId, itemId, guestCartId }) {
    await this.validateProductAndItem({ productId, itemId });

    const updatedCart = await CartModel.findOneAndUpdate(
      {
        ...this.genFindCartQuery({ userId, guestCartId }),
      },
      {
        $pull: {
          items: { productId, itemId },
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

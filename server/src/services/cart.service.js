import shopConfig from "../configs/shop.config.js";
import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import CartModel from "../models/cart.model.js";
import {
  clearCartCookie,
  genFindCartQuery,
  getCartItemsQuantity,
  returnMutatedCart,
  setCartCookie,
} from "../utils/cart.util.js";
import { getVariationString } from "../utils/sku.util.js";
import ProductService from "./product.service.js";
import SkuService from "./sku.service.js";

export default class CartService {
  static async findCartByUserId({ userId, lean = true }) {
    return CartModel.findOne({ userId }).lean(lean);
  }

  static async updateCartOwner({ cartId, userId }) {
    return CartModel.findByIdAndUpdate(cartId, { userId });
  }

  static async deleteCartById({ cartId }) {
    return await CartModel.findByIdAndDelete(cartId);
  }

  // Assign the guest cart to the user if the user logged in and does not have a cart.
  static async assignGuestCartToUser({ cartId, userId, res }) {
    const userCart = await CartService.findCartByUserId({ userId });

    if (cartId) {
      if (!userCart) {
        // If the user does not have a cart, assign the guest cart to the user.
        await CartService.updateCartOwner({ cartId, userId });
      } else {
        // If the user has a cart, delete the guest cart.
        CartService.deleteCartById({ cartId });
      }
      clearCartCookie(res);
    }
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

  static async getSimpleCart({ userId, guestCartId, res }) {
    const cart = await CartModel.findOne(
      genFindCartQuery({ userId, guestCartId })
    ).lean();

    //Clear cart cookie if guest cart is not found
    if (!userId && guestCartId && !cart) {
      clearCartCookie(res);
    }

    return {
      cart: {
        totalQuantity: getCartItemsQuantity(cart),
      },
    };
  }

  static async getCartDetail({ userId, guestCartId }) {
    const cart = await this.populateCart(
      CartModel.findOne(genFindCartQuery({ userId, guestCartId }))
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
      genFindCartQuery({ userId, guestCartId })
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
    return returnMutatedCart(cart);
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
          ...genFindCartQuery({ userId, guestCartId }),
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

    return returnMutatedCart(updatedCart);
  }

  static async removeCartItem({ userId, productId, skuId, guestCartId }) {
    await this.validateCartItem({ productId, skuId });

    const updatedCart = await this.populateCart(
      CartModel.findOneAndUpdate(
        {
          ...genFindCartQuery({ userId, guestCartId }),
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

    return returnMutatedCart(updatedCart);
  }

  static async clearCart({ userId, guestCartId, res }) {
    const cart = await CartModel.findOneAndUpdate(
      genFindCartQuery({ userId, guestCartId }),
      { items: [] },
      { new: true }
    );

    if (guestCartId) clearCartCookie(res);
    if (!cart) {
      throw new ErrorResponse(ERROR.CART.INVALID_CART);
    }
    return returnMutatedCart(cart);
  }
}

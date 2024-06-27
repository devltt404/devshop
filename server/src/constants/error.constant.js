const ERROR = Object.freeze({
  CART: {
    INSUFFICIENT_STOCK: {
      code: "ca001",
    },
    INVALID_CART: {
      status: 400,
      message: "Invalid cart",
      code: "ca002",
    },
  },
  PAYMENT: {
    EMPTY_CART: {
      status: 400,
      message: "Your cart is empty.",
      code: "pa001",
    },
    INSUFFICIENT_STOCK: {
      status: 400,
      message:
        "There is not enough stock for some items in your cart. Try to checkout again.",
      code: "pa002",
    },
  },
});

export default ERROR;

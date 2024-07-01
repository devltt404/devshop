const ERROR = Object.freeze({
  CART: {
    INSUFFICIENT_STOCK: ({ existingQty, availableQty }) => ({
      status: 400,
      code: "ca-001",
      message: `Insufficient stock. Only ${availableQty} available.${
        existingQty > 0 && " You already have " + existingQty + " in cart."
      }`,
    }),
    INVALID_CART: {
      status: 400,
      message: "Invalid cart. Please try again.",
      code: "ca-002",
    },
  },
  PAYMENT: {
    EMPTY_CART: {
      status: 400,
      message: "Your cart is empty. Please add some items to checkout.",
      code: "pa-001",
    },
    INSUFFICIENT_STOCK: {
      status: 400,
      message:
        "There is not enough stock for some items in your cart. Try to checkout again.",
      code: "pa-002",
    },
  },
  USER: {
    EMAIL_ALREADY_EXISTS: {
      status: 400,
      message: "Update failed. Some fields are invalid.",
      code: "us-001",
      errors: {
        email: "Email already exists.",
      },
    },
    USER_NOT_FOUND: {
      status: 400,
      message: "User not found. Please log in again.",
      code: "us-002",
    },
  },
});

export default ERROR;

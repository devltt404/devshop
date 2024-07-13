const ERROR = {
  AUTH: {
    MISSING_ACCESS_TOKEN: {
      status: 401,
      message: "Access token is missing.",
      code: "auth-001",
    },
    UNABLE_DECODE_ACCESS_TOKEN: {
      status: 401,
      message: "Invalid access token.",
      code: "auth-002",
    },
    INVALID_CREDENTIAL: {
      status: 401,
      message: "Invalid credential.",
      code: "auth-003",
    },
    INVALID_PERMISSION: {
      status: 403,
      message: "You don't have permission to access this path.",
      code: "auth-004",
    },
    MISSING_REFRESH_TOKEN: {
      status: 401,
      message: "Refresh token is missing.",
      code: "auth-005",
    },
    UNABLE_DECODE_REFRESH_TOKEN: {
      status: 401,
      message: "Invalid refresh token.",
      code: "auth-006",
    },
    EMAIL_ALREADY_EXISTS: {
      status: 400,
      message: "Email already exists. Please use another email.",
      code: "auth-007",
      errors: {
        email: "Email already exists. Please use another email.",
      },
    },
    INCORRECT_EMAIL_OR_PASSWORD: {
      status: 400,
      message: "Email or password is incorrect",
      code: "auth-008",
      errors: {
        email: "Email or password is incorrect",
        password: "Email or password is incorrect",
      },
    },
  },
  CATEGORY: {
    CATEGORY_NOT_FOUND: {
      status: 404,
      message: "Category not found.",
      code: "cat-001",
    },
    NAME_ALREADY_EXISTS: {
      status: 400,
      message: "Category name already exists.",
      code: "cat-002",
      errors: {
        name: "Category name already exists.",
      },
    },
    INVALID_PARENT_CATEGORY: {
      status: 400,
      message: "Invalid parent category.",
      code: "cat-003",
      errors: {
        parent: "Parent category not found.",
      },
    },
  },
  CART: {
    INSUFFICIENT_STOCK: ({ existingQty, availableQty }) => ({
      status: 400,
      code: "cart-001",
      message: `Insufficient stock. Only ${availableQty} available.${
        existingQty > 0 && " You already have " + existingQty + " in cart."
      }`,
    }),
    INVALID_CART: {
      status: 400,
      message: "Invalid cart. Please try again.",
      code: "cart-002",
    },
    INVALID_PRODUCT_ID: {
      status: 400,
      message: "Invalid product id.",
      code: "cart-003",
    },
    INVALID_ITEM_ID: {
      status: 400,
      message: "Invalid item id.",
      code: "cart-004",
    },
    INVALID_QUANTITY: {
      status: 400,
      message: "Invalid quantity. Quantity must be at least 1.",
      code: "cart-005",
    },
  },
  PAYMENT: {
    EMPTY_CART: {
      status: 400,
      message: "Your cart is empty. Please add some items to checkout.",
      code: "pay-001",
    },
    INSUFFICIENT_STOCK: {
      status: 400,
      message:
        "There is not enough stock for some items in your cart. Try to checkout again.",
      code: "pay-002",
    },
  },
  PRODUCT: {
    PRODUCT_NOT_FOUND: {
      status: 404,
      message: "Product not found.",
      code: "pro-001",
    },
    INVALID_CATEGORY: {
      status: 400,
      message: "Invalid category.",
      code: "pro-002",
    },
  },
  USER: {
    EMAIL_ALREADY_EXISTS: {
      status: 400,
      message: "Email already exists.",
      code: "user-001",
      errors: {
        email: "Email already exists.",
      },
    },
    INVALID_USER: {
      status: 400,
      message: "Invalid user. Please log in again.",
      code: "user-002",
    },
    ERROR_UPLOADING_PICTURE: {
      status: 500,
      message: "Error uploading picture.",
      code: "user-003",
    },
  },
  ORDER: {
    ORDER_NOT_FOUND: {
      status: 404,
      message: "Order not found.",
      code: "order-001",
    },
    INVALID_ORDER: {
      status: 400,
      message: "Invalid order id.",
      code: "order-002",
    },
    INVALID_ORDER_ITEM: {
      status: 400,
      message: "There's an invalid item in your cart. Your order is canceled.",
      code: "order-003",
    },
    INSUFFICIENT_STOCK: {
      status: 400,
      message: "An item is out of stock. Your order is canceled.",
      code: "order-004",
    },
  },
};

export default ERROR;

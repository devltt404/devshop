export const COOKIE_KEY = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  CART_ID: "cartId",
};

export const NODE_ENV = {
  development: "development",
  production: "production",
  test: "test",
};

export const ORDER = Object.freeze({
  STATUS: {
    PENDING: "pending",
    PROCESSING: "processing",
    PROCESSED: "processed",
  },
});

export const USER = Object.freeze({
  ROLE: {
    ADMIN: "admin",
    CUSTOMER: "customer",
  },
});

export const CLOUDINARY = Object.freeze({
  ALLOWED_FORMATS: {
    IMAGE: ["jpg", "png", "jpeg"],
  },
  FOLDER: {
    CATEGORY: "category",
    PRODUCT: "product",
    USER: "user",
  },
  MAX_SIZE: 1024 * 1024, // 1 MB
});

export const CATEGORY = Object.freeze({
  ID: {
    ALPHABET: "0123456789",
    LENGTH: 5,
  },
});

export const ORDER = Object.freeze({
  STATUS: {
    PENDING: "pending",
    PROCESSING: "processing",
    PROCESSED: "processed",
  },
});

export const PRODUCT = Object.freeze({
  TYPE: {
    SIMPLE: "simple",
    CONFIGURABLE: "configurable",
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

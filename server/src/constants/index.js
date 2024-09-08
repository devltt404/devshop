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

export const ORDER = Object.freeze({
  STATUS: {
    PENDING: "pending",
    PROCESSING: "processing",
    PROCESSED: "processed",
  },
});

export const PRODUCT_SORT_BY_OPTIONS = [
  { order: "desc", sortBy: "ctime", label: "Relevancy" }, //default
  { order: "asc", sortBy: "price", label: "Price: Low-High" },
  { order: "desc", sortBy: "price", label: "Price: High-Low" },
];

export const MEDIA_QUERY = Object.freeze({
  MOBILE: "(max-width: 768px)",
  TABLET: "(max-width: 992px)",
  LAPTOP: "(max-width: 1200px)",
  DESKTOP: "(min-width: 1201px)",
});

export const ENDPOINT = {
  API: "/api",
  AUTH: "/auth",
  CATEGORIES: "/categories",
  PRODUCTS: "/products",
  CART: "/cart",
  PAYMENT: "/payment",
  ORDERS: "/orders",
  USERS: "/users",
};

export const PRODUCT_SORT_FIELD = Object.freeze({
  price: "price",
  rating: "rating",
  ctime: "createdAt",
  sold: "numSold",
});

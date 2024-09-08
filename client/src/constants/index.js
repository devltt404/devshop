export const ORDER = Object.freeze({
  STATUS: {
    PENDING: "pending",
    PROCESSING: "processing",
    PROCESSED: "processed",
  },
});

export const PRODUCT = Object.freeze({
  SORT_BY_OPTIONS: [
    { value: "relevancy", label: "Relevancy" }, //default
    { value: "priceDesc", label: "Price: High-Low" },
    { value: "priceAsc", label: "Price: Low-High" },
  ],
});
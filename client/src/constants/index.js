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
    { value: "priceAsc", label: "Price: Low-High" },
    { value: "priceDesc", label: "Price: High-Low" },
  ],
});

export const MEDIA_QUERY = Object.freeze({
  MOBILE: "(max-width: 768px)",
  TABLET: "(max-width: 992px)",
  LAPTOP: "(max-width: 1200px)",
  DESKTOP: "(min-width: 1201px)",
});

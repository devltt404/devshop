export function getVariationString({ product, sku }) {
  return sku.variationIndex.length > 0
    ? sku.variationIndex
        .map((index, i) => product.variations[i].options[index].value)
        .join(" - ")
    : "";
}

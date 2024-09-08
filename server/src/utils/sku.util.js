export function getVariationString({ product, sku }) {
  return sku.variationIndex
    .map((index, i) => product.variations[i][index])
    .join(" - ");
}

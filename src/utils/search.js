export const normalizeSearchText = (value) => String(value ?? "")
  .normalize("NFKD")
  .toLowerCase()
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  .trim()
  .replace(/\s+/g, " ");

function searchableValues(product) {
  const fields = [
    product.name,
    product.brand,
    product.category,
    product.subcategory,
    product.sku,
    product.description,
    product.tags,
    product.scale,
    product.motor,
    product.motorKV,
    product.battery,
    product.drive,
    product.speed,
    product.chassis,
    product.suspension,
    product.dimensions,
    product.weight,
    product.waterproof,
    product.material,
    product.mount,
    product.compatibility,
    product.specs,
  ];

  return fields.flatMap((field) => {
    if (Array.isArray(field)) return field;
    if (field && typeof field === "object") return Object.entries(field).flat();
    return field == null ? [] : [field];
  }).join(" ");
}

export const matchesProductSearch = (product, query) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const productText = normalizeSearchText(searchableValues(product));
  const queryWords = normalizedQuery.split(" ");
  const everyWordMatches = queryWords.every((word) => productText.includes(word));
  const compactQueryMatches = normalizedQuery.replaceAll(" ", "").length > 2
    && productText.replaceAll(" ", "").includes(normalizedQuery.replaceAll(" ", ""));

  return everyWordMatches || compactQueryMatches;
};

// normalize spaces, punctuation, and letter case so a user can type a partial
// phrase without needing to match the product's exact spelling.
export const normalizeSearchText = (value) =>
  String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

// collect customer-facing product facts rather than searching the whole json
// object, which could accidentally match property names or image paths.
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

  return fields
    .flatMap((field) => {
      if (Array.isArray(field)) return field;
      if (field && typeof field === "object")
        return Object.entries(field).flat();
      return field == null ? [] : [field];
    })
    .join(" ");
}

// every word may match anywhere in the product fields. the compact comparison
// also lets a sku such as "mst533904r" match the saved value "mst-533904r".
export const matchesProductSearch = (product, query) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const productText = normalizeSearchText(searchableValues(product));
  const queryWords = normalizedQuery.split(" ");
  const everyWordMatches = queryWords.every((word) =>
    productText.includes(word),
  );
  const compactQueryMatches =
    normalizedQuery.replaceAll(" ", "").length > 2 &&
    productText
      .replaceAll(" ", "")
      .includes(normalizedQuery.replaceAll(" ", ""));

  return everyWordMatches || compactQueryMatches;
};

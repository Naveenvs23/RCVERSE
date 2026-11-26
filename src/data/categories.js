// build local image paths consistently from a photo's filename.
const image = (name) => `/images/products/${name}`;

// productCategories maps customer-friendly category names to the names in db.json.
export const categories = [
  {
    name: "RC Cars",
    slug: "rc-cars",
    description: "Road and rally cars for every driver.",
    image: image("rally-116.jpg"),
    productCategories: ["RC Cars"],
  },
  {
    name: "Drift Cars",
    slug: "drift-cars",
    description: "Drift-ready cars and chassis.",
    image: image("drift-mst-red.jpg"),
    productCategories: ["Drift Cars"],
  },
  {
    name: "Off-Road",
    slug: "off-road",
    description: "Buggies and trucks made for dirt.",
    image: image("shortcourse-associated.jpg"),
    productCategories: ["Off-road"],
  },
  {
    name: "RC Crawlers",
    slug: "rc-crawlers",
    description: "Trail-ready crawlers with scale detail.",
    image: image("crawler-axial.jpg"),
    productCategories: ["Rock Crawlers"],
  },
  {
    name: "RC Buggies",
    slug: "rc-buggies",
    description: "Fast, nimble buggies for the track.",
    image: image("buggy-team-magic.jpg"),
    matchText: ["buggy", "buggies"],
  },
  {
    name: "Touring Cars",
    slug: "touring-cars",
    description: "Low-profile cars for paved circuits.",
    image: image("rally-116.jpg"),
    matchText: ["touring"],
  },
  {
    name: "Spare Parts",
    slug: "spare-parts",
    description: "Parts to repair and upgrade your build.",
    image: image("shocks-aluminum.jpg"),
    productCategories: ["Spare Parts"],
  },
  {
    name: "Tires & Wheels",
    slug: "tires-wheels",
    description: "Tires and wheels for your terrain.",
    image: image("wheel-tire-green.jpg"),
    productCategories: ["Tires & Wheels"],
  },
  {
    name: "Motors & ESC",
    slug: "motors-esc",
    description: "Motors and speed controllers.",
    image: image("motor-hobbywing.jpg"),
    productCategories: ["Motors & ESC"],
  },
  {
    name: "Batteries & Chargers",
    slug: "batteries-chargers",
    description: "Batteries and charging equipment.",
    image: image("battery-absima.jpg"),
    productCategories: ["Batteries & Chargers"],
  },
  {
    name: "Tools & Equipment",
    slug: "tools-equipment",
    description: "Useful tools for the workbench.",
    image: image("hex-driver-set.jpg"),
    productCategories: ["Tools & Equipment"],
  },
  {
    name: "Accessories & Upgrades",
    slug: "accessories-upgrades",
    description: "Electronics, bodies and useful upgrades.",
    image: image("led-lightbar.jpg"),
    productCategories: ["Accessories & Upgrades"],
  },
];

export function categoryMatchesProduct(product, category) {
  // a missing category means no category filter is active.
  if (!category) return true;
  // prefer exact api category names when the customer category has that mapping.
  if (category.productCategories?.includes(product.category)) return true;
  // a few customer categories group products using words in their name or tags.
  const searchText = [
    product.name,
    product.subcategory,
    ...(product.tags || []),
  ]
    .join(" ")
    .toLowerCase();
  return category.matchText?.some((term) => searchText.includes(term)) || false;
}

export function findCategory(value) {
  // accept a url slug, customer label, or api category label.
  return categories.find(
    (category) =>
      category.slug === value ||
      category.name.toLowerCase() === String(value).toLowerCase() ||
      category.productCategories?.some(
        (name) => name.toLowerCase() === String(value).toLowerCase(),
      ),
  );
}

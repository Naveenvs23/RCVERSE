// use a relevant local fallback if a product's main photo cannot be loaded.
const fallbackByCategory = {
  "Drift Cars": "/images/products/drift-mst-red.jpg",
  "RC Cars": "/images/products/rally-116.jpg",
  "Off-road": "/images/products/buggy-team-magic.jpg",
  "Rock Crawlers": "/images/products/crawler-axial.jpg",
  "Spare Parts": "/images/products/shocks-aluminum.jpg",
  "Tires & Wheels": "/images/products/tire-wheel-set.jpg",
  "Motors & ESC": "/images/products/motor-hobbywing.jpg",
  "Batteries & Chargers": "/images/products/battery-absima.jpg",
  "Tools & Equipment": "/images/products/hex-driver-set.jpg",
  "Accessories & Upgrades": "/images/products/esc-hobbywing.jpg",
};

export default function ProductImage({ product, className = "", alt, ...props }) {
  const fallback = fallbackByCategory[product.category] || fallbackByCategory["RC Cars"];
  // onerror swaps to the fallback only once, avoiding an endless error loop if
  // both the original and fallback files are missing.
  return <img className={className} src={product.image || fallback} alt={alt ?? product.name}
    loading="lazy" onError={(event) => { if (event.currentTarget.src !== new URL(fallback, window.location.href).href) event.currentTarget.src = fallback; }} {...props}/>;
}

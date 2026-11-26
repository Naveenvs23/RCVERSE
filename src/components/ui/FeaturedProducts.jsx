import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../ProductCard";
import { fetchProducts } from "../../store/slices/productsSlice";
import "./FeaturedProducts.css";

// this small reusable shelf accepts a title and a prepared product list.
function ProductShelf({ title, products, id }) {
  return (
    <section className="home-shelf" id={id}>
      <div className="featured-header">
        <h2>{title}</h2>
        <Link to="/products">View all</Link>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default function FeaturedProducts() {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);
  // make sorted copies so these homepage rankings do not mutate redux's list.
  const featured = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);
  const newArrivals = [...products]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 4);

  if (status === "idle" || status === "loading")
    return (
      <section className="home-products">
        <p>Loading products…</p>
      </section>
    );
  if (status === "failed")
    return (
      <section className="home-products">
        <p>Products are unavailable right now.</p>
        <button
          className="secondary-button"
          onClick={() => dispatch(fetchProducts())}
        >
          Retry
        </button>
      </section>
    );
  if (!products.length)
    return (
      <section className="home-products">
        <p>No products are available yet.</p>
      </section>
    );

  return (
    <div className="home-products">
      <ProductShelf
        id="featured"
        title="Featured products"
        products={featured}
      />
      <ProductShelf title="New arrivals" products={newArrivals} />
    </div>
  );
}

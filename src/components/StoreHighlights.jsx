import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { fetchProducts } from "../store/slices/productsSlice";

export default function StoreHighlights() {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);
  const newestIds = new Set([...products].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 4).map((product) => String(product.id)));
  const popular = [...products]
    .filter((product) => !newestIds.has(String(product.id)))
    .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    .slice(0, 4);

  if (status === "failed") return <section className="home-highlights"><p>Popular products could not load.</p><button className="secondary-button" onClick={() => dispatch(fetchProducts())}>Retry</button></section>;
  if (status !== "succeeded" || !popular.length) return null;

  return <section className="home-highlights"><div className="shelf-heading"><h2>Popular products</h2><Link to="/products">View all</Link></div><div className="products-grid">{popular.map((product) => <ProductCard key={product.id} product={product}/>)}</div></section>;
}

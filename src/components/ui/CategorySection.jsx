import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { categories } from "../../data/categories";
import { fetchProducts } from "../../store/slices/productsSlice";
import "./CategorySection.css";

// category tiles use shared category data; selecting one opens its catalogue filter.
export default function CategorySection() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.products.status);

  return (
    <section className="category-section" id="categories">
      <div className="category-heading">
        <div><span className="section-tag">Shop by category</span><h2>Find your next build</h2></div>
        <Link className="category-view-all" to="/products">View all products</Link>
      </div>
      {status === "failed" && <div className="category-error"><p>Product information is temporarily unavailable.</p><button className="secondary-button" onClick={() => dispatch(fetchProducts())}>Retry</button></div>}
      <div className="category-grid">
        {categories.map((category) => (
          <Link className="category-card" key={category.slug} to={`/category/${category.slug}`}>
            <img src={category.image} alt={category.name} loading="lazy"/>
            <span>{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

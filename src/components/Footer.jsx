import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import "./Footer.css";

// the footer uses the central category list so its links stay aligned with the shop.
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Link className="footer-brand" to="/">
            RCVERSE
          </Link>
          <p>RC cars, parts and gear for your next build.</p>
        </div>
        <div className="footer-categories">
          <h2>Categories</h2>
          {categories.map((category) => (
            <Link key={category.slug} to={`/category/${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </div>
        <div className="footer-account">
          <h2>Shop & account</h2>
          <Link to="/products">All products</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/orders">My orders</Link>
          <Link to="/account">Account</Link>
        </div>
      </div>
      <div className="footer-bottom">© 2026 RCVERSE · Demo store · India</div>
    </footer>
  );
}

import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <main className="home">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-tag">RCVERSE · RC cars and parts</p>
          <h1>Find your next ride.</h1>
          <p className="hero-description">Shop RC cars, trail crawlers and the parts to make them your own.</p>
          <div className="hero-buttons">
            <Link to="/products" className="hero-button primary">Shop now</Link>
            <a href="#categories" className="hero-button secondary">Browse categories</a>
          </div>
        </div>
        <div className="hero-visual"><img src="/images/products/drift-mst-red.jpg" alt="RC drift car" fetchPriority="high"/></div>
      </section>
    </main>
  );
}

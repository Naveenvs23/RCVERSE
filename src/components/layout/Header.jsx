import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, Menu, Moon, Search, ShoppingCart, Sun, UserRound, X } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { categories } from "../../data/categories";
import ProductImage from "../ProductImage";
import { matchesProductSearch } from "../../utils/search";
import "./Header.css";

// the header reads counts and product suggestions from redux, while router hooks
// update the current page and keep search terms in the address bar.
export default function Header() {
  const cartItems = useSelector((state) => state.cart.items);
  const wishlist = useSelector((state) => state.wishlist.items);
  const products = useSelector((state) => state.products.items);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  // routekey tells this temporary input value apart from a value restored from
  // the current url after navigation.
  const routeKey = `${location.pathname}?${query}`;
  const [searchState, setSearchState] = useState(() => ({ routeKey, value: query }));
  const searchValue = searchState.routeKey === routeKey ? searchState.value : query;
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchRef = useRef(null);
  // use the saved theme when present; otherwise follow the operating system.
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("rcverse-theme");
    return savedTheme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  });

  // update the document theme and save the choice for the next visit.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("rcverse-theme", theme);
  }, [theme]);

  // close the suggestion panel when a pointer event happens outside this form.
  // the cleanup removes the listener when the header unmounts.
  useEffect(() => {
    const closeSearchOnOutsideClick = (event) => {
      if (!searchRef.current?.contains(event.target)) {
        setSearchFocused(false);
        setActiveSuggestion(-1);
      }
    };
    document.addEventListener("pointerdown", closeSearchOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeSearchOnOutsideClick);
  }, []);

  // only calculate suggestions when the query or redux product list changes.
  const suggestions = useMemo(() => {
    if (searchValue.trim().length < 2) return [];
    return products.filter((product) => matchesProductSearch(product, searchValue)).slice(0, 5);
  }, [products, searchValue]);

  function updateSearchValue(value) {
    setSearchState({ routeKey, value });
    setActiveSuggestion(-1);
  }

  function searchProducts(value) {
    // keep the current category path and other query options when submitting.
    const params = new URLSearchParams(location.search);
    const normalizedValue = value.trim().replace(/\s+/g, " ");
    if (normalizedValue) params.set("q", normalizedValue);
    else params.delete("q");

    // Keep the current category route so search and category filters combine.
    const path = location.pathname.startsWith("/category/") ? location.pathname : "/products";
    navigate(`${path}${params.size ? `?${params}` : ""}`, { replace: true });
    setSearchFocused(false);
    setActiveSuggestion(-1);
  }

  function handleSearchKeyDown(event) {
    // arrow keys move the highlighted suggestion; enter opens it and escape closes.
    if (!suggestions.length) {
      if (event.key === "Escape") setSearchFocused(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestion((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Escape") {
      setSearchFocused(false);
      setActiveSuggestion(-1);
    } else if (event.key === "Enter" && activeSuggestion >= 0) {
      event.preventDefault();
      navigate(`/products/${suggestions[activeSuggestion].id}`);
      setSearchFocused(false);
      setActiveSuggestion(-1);
    }
  }

  // sum quantities rather than cart rows, because one row can contain many units.
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="site-header">
      <div className="header-main">
        <Link className="brand" to="/" aria-label="RCVERSE home">
          <span className="brand-symbol">R</span>
          <span className="brand-name">RCVERSE</span>
        </Link>

        <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X/> : <Menu/>}
        </button>

        {/* category links are generated from the same data used by the catalogue. */}
        <nav className={`primary-nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <details className="category-menu">
            <summary>Categories</summary>
            <div className="category-menu-panel">
              {categories.map((category) => <Link key={category.slug} to={`/category/${category.slug}`} onClick={(event) => { setMenuOpen(false); event.currentTarget.closest("details")?.removeAttribute("open"); }}>{category.name}</Link>)}
            </div>
          </details>
        </nav>

        {/* form submission works with enter and the visible search button. */}
        <form ref={searchRef} className="header-search" role="search" onSubmit={(event) => { event.preventDefault(); searchProducts(searchValue); }}>
          <button className="search-submit" type="submit" aria-label="Search products"><Search size={19} aria-hidden="true"/></button>
          <input
            type="search"
            value={searchValue}
            placeholder="Search RC cars, parts and accessories..."
            aria-label="Search RC cars, parts and accessories"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={searchFocused && searchValue.trim().length >= 2}
            aria-controls="product-search-suggestions"
            aria-activedescendant={activeSuggestion >= 0 ? `product-suggestion-${suggestions[activeSuggestion]?.id}` : undefined}
            onFocus={() => setSearchFocused(true)}
            onKeyDown={handleSearchKeyDown}
            onChange={(event) => updateSearchValue(event.target.value)}
          />
          {searchValue && <button className="clear-search" type="button" aria-label="Clear search" onClick={() => { updateSearchValue(""); searchProducts(""); }}><X size={17}/></button>}
          {searchFocused && searchValue.trim().length >= 2 && <div className="search-suggestions" id="product-search-suggestions" role="listbox" aria-label="Product suggestions">
            {suggestions.length ? suggestions.map((product, index) => <Link id={`product-suggestion-${product.id}`} role="option" aria-selected={activeSuggestion === index} className={activeSuggestion === index ? "active" : ""} key={product.id} to={`/products/${product.id}`} onClick={() => { setSearchFocused(false); setActiveSuggestion(-1); }}><ProductImage product={product} alt=""/><span>{product.name}<small>{product.brand}</small></span><strong>₹{product.price.toLocaleString("en-IN")}</strong></Link>) : <p className="search-no-results">No products match “{searchValue.trim()}”.</p>}
            <button className="all-results" type="submit">{suggestions.length ? "See all matching products" : "View search results"}</button>
          </div>}
        </form>

        <div className="header-actions">
          <Link to="/wishlist" aria-label={`Wishlist, ${wishlist.length} items`}><Heart/><span className="action-count">{wishlist.length}</span></Link>
          <button className="theme-toggle" type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun/> : <Moon/>}</button>
          <Link to={user ? "/account" : "/login"} aria-label={user ? `Account: ${user.name}` : "Log in"}><UserRound/></Link>
          <Link to="/cart" className="cart-link" aria-label={`Shopping cart, ${cartCount} items`}><ShoppingCart/><span className="cart-count">{cartCount}</span></Link>
        </div>
      </div>
    </header>
  );
}

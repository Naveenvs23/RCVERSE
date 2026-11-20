import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Trash2, ArrowLeft, ShoppingCart, Heart, Star } from "lucide-react";
import Header from "./components/layout/Header";
import Footer from "./components/Footer";
import CategorySection from "./components/ui/CategorySection";
import FeaturedProducts from "./components/ui/FeaturedProducts";
import ProductCard from "./components/ProductCard";
import ProductImage from "./components/ProductImage";
import ToastHost from "./components/ToastHost";
import { showToast } from "./utils/toast";
import { matchesProductSearch } from "./utils/search";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { categories, categoryMatchesProduct, findCategory } from "./data/categories";
import { fetchProducts, fetchProductById } from "./store/slices/productsSlice";
import { addToCart } from "./store/slices/cartSlice";
import { removeWishlist, toggleWishlist } from "./store/slices/wishlistSlice";
import { LoginPage, RegisterPage, AccountPage } from "./pages/Account";
import { CheckoutPage, PaymentPage, OrderConfirmation } from "./pages/CheckoutFlow";
import StoreHighlights from "./components/StoreHighlights";
import { OrdersPage, OrderDetailsPage, OrderSuccessPage, TrackOrderPage } from "./pages/Orders";
import "./App.css";
import "./styles/redesign.css";
import "./styles/theme.css";

function Catalogue() {
  const dispatch=useDispatch();const {items:products,status,error}=useSelector((state)=>state.products);const isLoading=status==="loading"||status==="idle";const isError=status==="failed";const refetch=()=>dispatch(fetchProducts());
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const activeCategory = findCategory(categorySlug) || findCategory(params.get("category"));
  const category = activeCategory?.name || "All categories";
  const [sort, setSort] = useState("price-low");
  const pageKey = `${categorySlug || params.get("category") || ""}|${q.toLowerCase()}`;
  const [pageState, setPageState] = useState({ key: "", page: 1 });
  const page = pageState.key === pageKey ? pageState.page : 1;
  let visible = products.filter((item) => matchesProductSearch(item,q) && categoryMatchesProduct(item,activeCategory));
  if (sort === "price-low") visible.sort((a,b)=>a.price-b.price);
  if (sort === "price-high") visible.sort((a,b)=>b.price-a.price);
  const pageSize=12;const pageCount=Math.max(1,Math.ceil(visible.length/pageSize));const currentPage=Math.min(page,pageCount);const pageItems=visible.slice((currentPage-1)*pageSize,currentPage*pageSize);
  const clearFilters = () => { navigate("/products");setSort("price-low");setParams({}); };
  const clearSearch = () => { const nextParams = new URLSearchParams(params); nextParams.delete("q"); setParams(nextParams); };
  const changeCategory = (value) => {
    const nextCategory = categories.find((item) => item.name === value);
    const nextParams = new URLSearchParams(params);
    nextParams.delete("category");
    navigate(`${nextCategory ? `/category/${nextCategory.slug}` : "/products"}${nextParams.size ? `?${nextParams}` : ""}`);
  };
  return <main className="store-page"><div className="page-intro catalog-intro"><span className="eyebrow">Shop</span><h1>{category === "All categories" ? "All products" : category.toUpperCase()}</h1><p>{categories.find((item)=>item.name===category)?.description || "Find something for your next RC build."}</p></div>
    <div className="catalog-layout"><aside className="filters"><div className="filter-heading"><h2><SlidersHorizontal size={17}/> Filter products</h2><button className="text-button" onClick={clearFilters}>CLEAR ALL</button></div>
      <label>Category<select value={category} onChange={(e)=>changeCategory(e.target.value)}><option>All categories</option>{categories.map((item)=><option key={item.slug}>{item.name}</option>)}</select></label>
    </aside><section className="catalog-results">{isLoading?<div className="empty-state">LOADING PRODUCT INVENTORY…</div>:isError?<div className="empty-state"><h2>Inventory unavailable</h2><button className="primary-button" onClick={()=>refetch()}>RETRY</button><p>{error}</p></div>:<><div className="catalog-toolbar"><span className="search-summary"><strong>{visible.length}</strong> products {q&&<>matching <b>“{q}”</b></>}</span>{q&&<button className="clear-results-search" type="button" onClick={clearSearch}>Clear search</button>}<select aria-label="Sort products" value={sort} onChange={(e)=>setSort(e.target.value)}><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option></select></div>{visible.length?<><div className="products-grid">{pageItems.map((item)=><ProductCard key={item.id} product={item}/>)}</div>{pageCount>1&&<div className="pagination"><button disabled={currentPage===1} onClick={()=>setPageState({key:pageKey,page:currentPage-1})}>← PREVIOUS</button><span>PAGE {currentPage} / {pageCount}</span><button disabled={currentPage===pageCount} onClick={()=>setPageState({key:pageKey,page:currentPage+1})}>NEXT →</button></div>}</>:<div className="empty-state"><Search/><h2>No products match “{q}”</h2><p>Try another search term or clear the active search and filters.</p><button className="text-button" onClick={clearFilters}>CLEAR ALL FILTERS</button></div>}</>}</section></div></main>;
}
function ProductDetail() {
  const {id}=useParams();const dispatch=useDispatch();const navigate=useNavigate();const location=useLocation();const catalogue=useSelector((state)=>state.products.items);const selectedProduct=useSelector((state)=>String(state.products.selected?.id)===id?state.products.selected:null);const product=catalogue.find((item)=>String(item.id)===id)||selectedProduct;const detailStatus=useSelector((state)=>state.products.detailStatus);const detailError=useSelector((state)=>state.products.error);const [quantity,setQuantity]=useState(1);const [imageIndex,setImageIndex]=useState(0);useEffect(()=>{if(!product)dispatch(fetchProductById(id));},[dispatch,id,product]);
  const wished=useSelector((state)=>state.wishlist.items.some((item)=>item.id===product?.id));const user=useSelector((state)=>state.auth.user);const cartQty=useSelector((state)=>state.cart.items.find((item)=>item.id===product?.id)?.quantity||0);
  if(!product&&detailStatus==="loading")return <main className="store-page empty-state">LOADING PRODUCT…</main>;
  if(!product&&detailStatus==="failed")return <main className="store-page empty-state"><h1>PRODUCT COULD NOT LOAD</h1><p>{detailError}</p><button className="primary-button" onClick={()=>dispatch(fetchProductById(id))}>RETRY</button><Link to="/products">Back to products</Link></main>;
  if(!product)return <main className="store-page empty-state"><h1>PRODUCT NOT FOUND</h1><Link to="/products">Back to catalogue</Link></main>;
  const gallery=product.gallery?.length?product.gallery:[product.image];const related=catalogue.filter((item)=>item.id!==product.id&&item.category===product.category).slice(0,4);const otherRelated=related.length>=4?related:related.concat(catalogue.filter((item)=>item.id!==product.id&&!related.some((r)=>r.id===item.id)).slice(0,4-related.length));
  const add=()=>{if(!product.stock)return;if(cartQty+quantity>product.stock){showToast({type:"info",title:"STOCK LIMIT",message:"Not enough units remain in stock."});return;}for(let i=0;i<quantity;i++)dispatch(addToCart(product));showToast({type:"cart",title:"ADDED TO CART",product,quantity});};
  const toggleSave=()=>{if(!user){navigate("/login",{state:{from:location}});return;}dispatch(toggleWishlist(product));showToast({type:"saved",title:wished?"REMOVED FROM WISHLIST":"ADDED TO WISHLIST",product});};
  
  const productCategory=categories.find((category)=>categoryMatchesProduct(product,category));
  return <main className="store-page detail-page"><Link className="back-link" to={productCategory?`/category/${productCategory.slug}`:"/products"}><ArrowLeft size={15}/> {productCategory?.name||"PRODUCTS"}</Link><div className="detail-layout"><div className="detail-gallery"><div className="detail-image"><ProductImage product={{...product,image:gallery[imageIndex]}}/><span className="product-tag">{product.tag}</span>{product.discount>0&&<span className="discount-badge">−{product.discount}%</span>}</div>{gallery.length>1&&<div className="gallery-thumbs">{gallery.map((src,index)=><button className={imageIndex===index?"active":""} type="button" key={src} aria-label={`View image ${index+1}`} onClick={()=>setImageIndex(index)}><img src={src} alt="" loading="lazy"/></button>)}</div>}</div><div className="detail-info"><span className="eyebrow">{product.brand} · {product.category} · {product.scale}</span><h1>{product.name}</h1><p className="detail-sku">SKU {product.sku} · {product.subcategory}</p><div className="product-rating"><Star size={15} fill="currentColor"/> {product.rating} <span className="review-count">({product.reviews} verified reviews)</span></div><div className="detail-price">₹{product.price.toLocaleString("en-IN")}{product.oldPrice&&<del>₹{product.oldPrice.toLocaleString("en-IN")}</del>}{product.discount>0&&<span className="detail-discount">SAVE {product.discount}%</span>}</div><p>{product.description}</p><p className={`stock-line ${product.stock?"":"sold-out"}`}>● {product.stock?`${product.stock} units ready to ship`:"Currently out of stock"}</p><div className="detail-buy-row"><div className="quantity-controls"><button type="button" aria-label="Decrease quantity" onClick={()=>setQuantity(Math.max(1,quantity-1))}>−</button><span>{quantity}</span><button type="button" aria-label="Increase quantity" onClick={()=>setQuantity(Math.min(20,product.stock,quantity+1))}>+</button></div><button className="primary-button detail-add" disabled={!product.stock} onClick={add}><ShoppingCart size={16}/> ADD TO CART</button></div><div className="detail-secondary-actions"><button className={wished?"wish-active":""} onClick={toggleSave}><Heart size={16} fill={wished?"currentColor":"none"}/> {wished?"SAVED TO WISHLIST":"ADD TO WISHLIST"}</button></div><h3>Specifications</h3><dl className="spec-list">{Object.entries(product.specs).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl><div className="detail-information"><section><h3>Compatibility</h3><p>{product.compatibility}</p></section><section><h3>In the box</h3><p>{product.included}</p></section><section><h3>Shipping and warranty</h3><p>Dispatch estimate: 1–3 working days in this demo. {product.warranty}</p></section></div></div></div><section className="related"><div className="related-title"><div><span className="eyebrow">More to explore</span><h2>Related products</h2></div><Link to={productCategory?`/category/${productCategory.slug}`:"/products"}>SHOP {productCategory?.name||"PRODUCTS"} →</Link></div><div className="products-grid">{otherRelated.map((item)=><ProductCard key={item.id} product={item}/>)}</div></section></main>;
}
function WishlistPage(){const items=useSelector((s)=>s.wishlist.items);const dispatch=useDispatch();const moveToCart=(product)=>{if(!product.stock){showToast({type:"info",title:"OUT OF STOCK",product});return;}dispatch(addToCart({...product,quantity:1}));dispatch(removeWishlist(product.id));showToast({type:"cart",title:"MOVED TO CART",product,quantity:1});};return <main className="store-page"><div className="page-intro"><span className="eyebrow">PIT HQ / SAVED BUILDS</span><h1>YOUR WISHLIST</h1><p>{items.length} saved products</p></div>{items.length?<div className="products-grid">{items.map((p)=><div className="wishlist-wrap" key={p.id}><ProductCard product={p}/><button className="text-button remove-saved" onClick={()=>moveToCart(p)}>MOVE TO CART</button><button className="text-button remove-saved" onClick={()=>{dispatch(removeWishlist(p.id));showToast({type:"info",title:"REMOVED FROM WISHLIST",product:p});}}><Trash2 size={14}/> REMOVE FROM SAVED</button></div>)}</div>:<div className="empty-state"><h2>No saved products yet</h2><p>Use the heart on any product to keep it here.</p><Link className="primary-button" to="/products">EXPLORE PRODUCTS</Link></div>}</main>}
function ProtectedRoute({children}){const user=useSelector((state)=>state.auth.user);const location=useLocation();return user?children:<Navigate to="/login" replace state={{from:location}}/>;}
function NotFound(){return <main className="store-page empty-state"><span className="eyebrow">404 / OFF TRACK</span><h1>PAGE NOT FOUND</h1><Link to="/">Return to home</Link></main>}
function App(){const dispatch=useDispatch();useEffect(()=>{dispatch(fetchProducts());},[dispatch]);return <BrowserRouter><Header/><Routes><Route path="/" element={<><Home/><CategorySection/><FeaturedProducts/><StoreHighlights/></>}/><Route path="/products" element={<Catalogue/>}/><Route path="/category/:categorySlug" element={<Catalogue/>}/><Route path="/products/:id" element={<ProductDetail/>}/><Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>}/><Route path="/wishlist" element={<ProtectedRoute><WishlistPage/></ProtectedRoute>}/><Route path="/checkout" element={<ProtectedRoute><CheckoutPage/></ProtectedRoute>}/><Route path="/payment" element={<ProtectedRoute><PaymentPage/></ProtectedRoute>}/><Route path="/orders" element={<ProtectedRoute><OrdersPage/></ProtectedRoute>}/><Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetailsPage/></ProtectedRoute>}/><Route path="/track-order/:orderNumber" element={<ProtectedRoute><TrackOrderPage/></ProtectedRoute>}/><Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccessPage/></ProtectedRoute>}/><Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmation/></ProtectedRoute>}/><Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/><Route path="/account" element={<AccountPage/>}/><Route path="*" element={<NotFound/>}/></Routes><ToastHost/><Footer/></BrowserRouter>}
export default App;

import { Heart, ShoppingCart } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { toggleWishlist } from "../store/slices/wishlistSlice";
import { showToast } from "../utils/toast";
import ProductImage from "./ProductImage";
import { categories, categoryMatchesProduct } from "../data/categories";

// product cards receive one product from their parent. redux supplies the
// current user, cart, and wishlist so all cards stay in sync after an action.
export default function ProductCard({ product }) {
  const dispatch=useDispatch();const navigate=useNavigate();const location=useLocation();const user=useSelector((state)=>state.auth.user);
  const wished=useSelector((state)=>state.wishlist.items.some((item)=>item.id===product.id));
  const cartItems=useSelector((state)=>state.cart.items);
  // stop adding when stock is empty or the cart already holds the stock limit.
  const add=()=>{const prior=cartItems.find((item)=>item.id===product.id)?.quantity||0;if(!product.stock)return;if(prior>=product.stock){showToast({type:"info",title:"STOCK LIMIT REACHED",message:`Only ${product.stock} units are available.`});return;}dispatch(addToCart(product));showToast({type:"cart",title:"ADDED TO CART",product,quantity:1});};
  // wishlist actions require an account; otherwise remember this page as the
  // destination to return to after the mock sign-in.
  const save=()=>{if(!user){navigate("/login",{state:{from:location}});return;}dispatch(toggleWishlist(product));showToast({type:"saved",title:wished?"REMOVED FROM WISHLIST":"ADDED TO WISHLIST",product});};
  // category matching also handles customer-facing category labels that differ
  // slightly from the api's category name.
  const cat=categories.find((entry)=>categoryMatchesProduct(product,entry));
  return <article className="product-card"><div className="product-image"><Link to={`/products/${product.id}`} aria-label={`View ${product.name}`}><ProductImage product={product}/></Link>{product.discount>0&&<span className="discount-badge">−{product.discount}%</span>}<button className={`icon-action wishlist-action ${wished?"selected":""}`} type="button" aria-label={wished?"Remove from wishlist":"Add to wishlist"} onClick={save}><Heart size={18} fill={wished?"currentColor":"none"}/></button></div><div className="product-info">{cat&&<Link className="product-category" to={`/category/${cat.slug}`}>{cat.name}</Link>}<Link className="product-name" to={`/products/${product.id}`}>{product.name}</Link><div className="product-price"><strong>₹{product.price.toLocaleString("en-IN")}</strong>{product.oldPrice&&<del>₹{product.oldPrice.toLocaleString("en-IN")}</del>}</div><span className={`product-stock ${product.stock?"in-stock":"out-of-stock"}`}>{product.stock?"In stock":"Out of stock"}</span><button className="add-to-cart-btn" type="button" disabled={!product.stock} onClick={add}><ShoppingCart size={16}/>{product.stock?"Add to cart":"Out of stock"}</button><Link className="product-details-link" to={`/products/${product.id}`}>View details</Link></div></article>;
}

import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../store/slices/cartSlice";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import "./Cart.css";
import ProductImage from "../components/ProductImage";
import { showToast } from "../utils/toast";

export default function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  // reduce visits each item and adds price times quantity to one subtotal.
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 5000 ? 0 : 199;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <span className="section-label">YOUR GARAGE</span>
        <h1>SHOPPING CART</h1>
        <p>
          {cartItems.reduce((total, item) => total + item.quantity, 0)} items ·{" "}
          {cartItems.length} different products
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <ShoppingBag size={55} />
          <h2>Your cart is empty</h2>
          <p>Find your next RC upgrade and add it to your garage.</p>

          <Link to="/" className="continue-shopping">
            <ArrowLeft size={17} />
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {/* map creates one row for each product saved in the redux cart. */}
            {cartItems.map((item) => (
              <article className="cart-item" key={item.id}>
                <ProductImage product={item} />

                <div className="cart-item-details">
                  <h3>{item.name}</h3>

                  <p>₹{item.price.toLocaleString("en-IN")}</p>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                    >
                      <Minus size={15} />
                    </button>

                    {/* input changes go through the reducer, which clamps stock. */}
                    <input
                      aria-label={`Quantity for ${item.name}`}
                      type="number"
                      min="1"
                      max={item.stock || 1}
                      value={item.quantity}
                      onChange={(event) =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: event.target.value,
                          }),
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() => dispatch(increaseQuantity(item.id))}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <strong>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </strong>

                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => (
                      dispatch(removeFromCart(item.id)),
                      showToast({
                        type: "info",
                        title: "REMOVED FROM CART",
                        product: item,
                      })
                    )}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))}

            <button
              type="button"
              className="clear-cart"
              onClick={() => {
                dispatch(clearCart());
                showToast({
                  type: "info",
                  title: "CART CLEARED",
                  message: "Your garage cart is empty.",
                });
              }}
            >
              CLEAR CART
            </button>
          </section>

          <aside className="cart-summary">
            <h2>ORDER SUMMARY</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <strong>
                {shipping
                  ? `₹${shipping.toLocaleString("en-IN")}`
                  : "COMPLIMENTARY"}
              </strong>
            </div>

            <div className="summary-row">
              <span>Estimated tax (5%)</span>
              <strong>₹{tax.toLocaleString("en-IN")}</strong>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>

            <Link to="/checkout" className="checkout-btn">
              PROCEED TO CHECKOUT
            </Link>

            <Link to="/" className="back-shopping">
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

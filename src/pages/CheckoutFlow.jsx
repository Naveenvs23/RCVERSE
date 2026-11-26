import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { clearCart } from "../store/slices/cartSlice";
import { submitOrder } from "../store/slices/ordersSlice";

// the same numbered progress bar is reused by shipping and payment screens.
function Steps({ active }) {
  return (
    <div className="checkout-steps">
      {[
        [1, "SHIPPING"],
        [2, "PAYMENT"],
        [3, "CONFIRMATION"],
      ].map(([n, label]) => (
        <div className={active >= n ? "active" : ""} key={n}>
          <span>{n}</span>
          {label}
        </div>
      ))}
    </div>
  );
}
// summary receives already-calculated values so both checkout steps show the
// same item list, shipping cost, tax, and total.
function Summary({ items, subtotal, shipping, tax, total }) {
  return (
    <aside className="order-summary checkout-card">
      <h2>ORDER SUMMARY</h2>
      <div className="summary-products">
        {items.map((p) => (
          <div className="summary-product" key={p.id}>
            <img src={p.image} alt="" />
            <span>
              {p.name}
              <small>QTY {p.quantity}</small>
            </span>
            <strong>₹{(p.price * p.quantity).toLocaleString("en-IN")}</strong>
          </div>
        ))}
      </div>
      <div className="summary-row">
        <span>Subtotal</span>
        <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
      </div>
      <div className="summary-row">
        <span>Shipping</span>
        <strong>{shipping ? `₹${shipping}` : "COMPLIMENTARY"}</strong>
      </div>
      <div className="summary-row">
        <span>Estimated tax (5%)</span>
        <strong>₹{tax.toLocaleString("en-IN")}</strong>
      </div>
      <div className="summary-total">
        <span>Order total</span>
        <strong>₹{total.toLocaleString("en-IN")}</strong>
      </div>
      <small className="demo-notice">MOCK CHECKOUT · NO PAYMENT GATEWAY</small>
    </aside>
  );
}

// shipping reads cart items from redux, validates stock, and carries form data
// and totals to the next route using router navigation state.
export function CheckoutPage() {
  const items = useSelector((s) => s.cart.items);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const pinField = register("pin", {
    required: "PIN code is required.",
    pattern: {
      value: /^[0-9]{6}$/,
      message: "PIN code must contain exactly 6 digits.",
    },
  });
  const subtotal = items.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 199;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;
  const unavailable = items.some(
    (item) => !item.stock || item.quantity > item.stock,
  );
  if (!items.length)
    return (
      <main className="store-page">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <Link to="/products">Browse the garage</Link>
        </div>
      </main>
    );
  if (unavailable)
    return (
      <main className="store-page">
        <div className="empty-state">
          <h2>Review your cart</h2>
          <p>
            One or more items are out of stock or above the available quantity.
          </p>
          <Link className="primary-button" to="/cart">
            RETURN TO CART
          </Link>
        </div>
      </main>
    );
  return (
    <main className="store-page checkout-page">
      <div className="page-intro">
        <span className="eyebrow">CHECKOUT / MOCK ORDER</span>
        <h1>SHIPPING DETAILS</h1>
        <p>
          This internship demo stores orders through JSON Server. No payment is
          processed.
        </p>
      </div>
      <Steps active={1} />
      <div className="checkout-layout">
        <form
          className="checkout-form checkout-card"
          noValidate
          onSubmit={handleSubmit((fields) => {
            navigate("/payment", {
              state: {
                shippingInfo: fields,
                totals: { subtotal, shipping, tax, total },
              },
            });
          })}
        >
          <h2>01 / DELIVERY CONTACT</h2>
          <div className="form-grid">
            <label>
              Full name
              <input
                {...register("name", {
                  required: "Enter your full name.",
                  pattern: {
                    value: /^[\p{L}][\p{L}\p{M}\s.'-]*$/u,
                    message: "Enter a valid name using letters only.",
                  },
                })}
                autoComplete="name"
              />
              {errors.name && (
                <small className="field-error">{errors.name.message}</small>
              )}
            </label>
            <label>
              Phone number
              <input
                {...register("phone", {
                  required: "Enter your phone number.",
                  pattern: {
                    value: /^[6-9][0-9]{9}$/,
                    message: "Enter a valid 10-digit Indian mobile number.",
                  },
                })}
                type="tel"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel-national"
              />
              {errors.phone && (
                <small className="field-error">{errors.phone.message}</small>
              )}
            </label>
            <label>
              Email
              <input
                {...register("email", {
                  required: "Enter your email.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
                type="email"
                autoComplete="email"
              />
              {errors.email && (
                <small className="field-error">{errors.email.message}</small>
              )}
            </label>
            <label className="wide">
              Street address
              <input
                {...register("address", {
                  validate: (value) =>
                    value.trim().length > 0 || "Enter your street address.",
                })}
                autoComplete="street-address"
              />
              {errors.address && (
                <small className="field-error">{errors.address.message}</small>
              )}
            </label>
            <label>
              City
              <input
                {...register("city", { required: "Enter your city." })}
                autoComplete="address-level2"
              />
              {errors.city && (
                <small className="field-error">{errors.city.message}</small>
              )}
            </label>
            <label>
              PIN code
              <input
                {...pinField}
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                onChange={(event) => {
                  const digits = event.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 6);
                  event.target.value = digits;
                  pinField.onChange(event);
                }}
              />
              {errors.pin && (
                <small className="field-error">{errors.pin.message}</small>
              )}
            </label>
          </div>
          <button className="primary-button full-button">
            CONTINUE TO MOCK PAYMENT <span>→</span>
          </button>
        </form>
        <Summary
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
        />
      </div>
    </main>
  );
}

// payment is deliberately simulated. it records a chosen label only, then
// sends an order record to json server without collecting payment credentials.
export function PaymentPage() {
  const items = useSelector((s) => s.cart.items);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const shippingInfo = location.state?.shippingInfo;
  const totals = location.state?.totals;
  const [method, setMethod] = useState("UPI");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const orderStatus = useSelector((s) => s.orders.status);
  if (!shippingInfo || !totals) return <Navigate to="/checkout" replace />;
  // create a stable order snapshot from current cart, shipping, and payment choice.
  const submit = async (e) => {
    e.preventDefault();
    if (busy || !items.length) return;
    setBusy(true);
    setError("");
    const now = new Date();
    const order = {
      orderNumber: `RC-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`,
      userId: Number.isNaN(Number(user.id)) ? user.id : Number(user.id),
      createdAt: now.toISOString(),
      items: items.map(({ id, name, image, price, quantity, sku }) => ({
        id,
        name,
        image,
        price,
        quantity,
        sku,
      })),
      shippingInfo,
      paymentMethod: method,
      paymentStatus:
        method === "CASH ON DELIVERY"
          ? "Pay on Delivery"
          : "Mock payment selected",
      status: "Order Placed",
      trackingHistory: [{ status: "Order Placed", date: now.toISOString() }],
      ...totals,
    };
    try {
      const saved = await dispatch(submitOrder(order)).unwrap();
      dispatch(clearCart());
      navigate(`/order-success/${saved.id}`, { replace: true });
    } catch (err) {
      setError(err || "Unable to place your order. Please retry.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="store-page checkout-page">
      <div className="page-intro">
        <span className="eyebrow">PAYMENT METHOD / MOCK</span>
        <h1>PLACE YOUR ORDER</h1>
        <p>
          Select a mock payment method. This app does not collect payment
          details or process money.
        </p>
      </div>
      <Steps active={2} />
      <div className="checkout-layout">
        <form
          className="checkout-form checkout-card payment-card"
          onSubmit={submit}
        >
          <h2>02 / PAYMENT METHOD</h2>
          <div className="payment-methods">
            {["UPI", "CARD (MOCK)", "CASH ON DELIVERY"].map((value) => (
              <label className={method === value ? "selected" : ""} key={value}>
                <input
                  type="radio"
                  name="method"
                  value={value}
                  checked={method === value}
                  onChange={() => setMethod(value)}
                />
                {value}
              </label>
            ))}
          </div>
          <p className="mock-payment-note">
            {method === "CASH ON DELIVERY"
              ? "Your order will be placed with payment due on delivery."
              : "This selection is recorded for the mock order only. No UPI ID, card number, CVV or bank credential is requested."}
          </p>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="payment-submit-row">
            <Link to="/checkout" className="back-link">
              ← BACK TO SHIPPING
            </Link>
            <button
              className="primary-button"
              disabled={busy || orderStatus === "placing"}
            >
              {busy || orderStatus === "placing"
                ? "SAVING MOCK ORDER…"
                : "PLACE ORDER"}
            </button>
          </div>
        </form>
        <Summary
          items={items}
          subtotal={totals.subtotal}
          shipping={totals.shipping}
          tax={totals.tax}
          total={totals.total}
        />
      </div>
    </main>
  );
}

export function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  return (
    <main className="store-page empty-state">
      <CheckCircle2 />
      <h1>ORDER PLACED</h1>
      <p>Order {orderId} has been saved.</p>
      <button
        className="primary-button"
        onClick={() => navigate(`/orders/${orderId}`)}
      >
        VIEW ORDER
      </button>
      <Link to="/orders">MY ORDERS</Link>
    </main>
  );
}

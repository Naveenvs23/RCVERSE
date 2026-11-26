import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { register, signIn, signOut } from "../store/slices/authSlice";

// this shared wrapper keeps the visual panel and form layout the same on the
// sign-in and registration screens. children is the form content for that page.
function Shell({ label, title, children }) {
  return (
    <main className="account-page">
      <section className="account-visual">
        <span className="eyebrow">RCVERSE / DRIVER ACCESS</span>
        <h1>
          BUILT FOR THE
          <br />
          <em>LONG RUN.</em>
        </h1>
        <p>Your builds, saved products and order history in one place.</p>
        <div className="account-visual-mark">
          R<span> / 01</span>
        </div>
        <span className="account-visual-foot">
          INTERNSHIP MOCK STORE · JSON SERVER
        </span>
      </section>
      <section className="account-form-side">
        <div className="account-form-box">
          <span className="eyebrow">{label}</span>
          <h2>{title}</h2>
          {children}
          <p className="demo-notice">
            MOCK AUTHENTICATION · JSON SERVER IS NOT PRODUCTION SECURITY
          </p>
        </div>
      </section>
    </main>
  );
}

// login sends the form values through a redux thunk. unwrap turns a rejected
// thunk into a catchable error, and finally always removes the busy state.
export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // return to the page that asked the user to sign in, or open the account page.
  const destination = location.state?.from;
  const redirect = () =>
    navigate(
      destination
        ? `${destination.pathname || destination}${destination.search || ""}`
        : "/account",
      { replace: true },
    );
  const login = async (email, password) => {
    setBusy(true);
    setError("");
    try {
      await dispatch(signIn({ email, password })).unwrap();
      redirect();
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Shell label="DRIVER SIGN IN" title="WELCOME BACK.">
      <p className="form-copy">
        Sign in to view your RCVERSE garage and orders.
      </p>
      <form
        noValidate
        onSubmit={handleSubmit(({ email, password }) =>
          login(email.trim(), password),
        )}
      >
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            {...registerField("email", {
              required: "Enter your email.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            })}
            placeholder="driver@example.com"
          />
          {errors.email && (
            <small className="field-error">{errors.email.message}</small>
          )}
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            {...registerField("password", {
              required: "Enter your password.",
              minLength: { value: 6, message: "Use at least 6 characters." },
            })}
            placeholder="Password"
          />
          {errors.password && (
            <small className="field-error">{errors.password.message}</small>
          )}
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary-button full-button" disabled={busy}>
          {busy ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>
      <div className="form-divider">
        <span>SEE THE MOCK AUTH FLOW</span>
      </div>
      <button
        className="demo-login-button"
        disabled={busy}
        onClick={() => login("alex@rcverse.demo", "demo1234")}
      >
        SIGN IN WITH SEEDED DEMO USER
      </button>
      <p className="form-switch">
        New to RCVERSE? <Link to="/register">Create an account</Link>
      </p>
    </Shell>
  );
}

// registration checks that both password fields agree before calling the api.
export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const submit = async (form) => {
    setBusy(true);
    setError("");
    try {
      const user = await dispatch(register(form)).unwrap();
      navigate(location.state?.from?.pathname || "/account", {
        replace: true,
        state: { registered: user.email },
      });
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Shell label="NEW DRIVER REGISTRATION" title="JOIN THE GRID.">
      <p className="form-copy">Create a mock account stored by JSON Server.</p>
      <form
        noValidate
        onSubmit={handleSubmit((data) =>
          submit({
            name: data.name.trim(),
            email: data.email.trim(),
            password: data.password,
          }),
        )}
      >
        <label>
          Full name
          <input
            name="name"
            autoComplete="name"
            {...registerField("name", { required: "Enter your name." })}
            placeholder="Alex Morgan"
          />
          {errors.name && (
            <small className="field-error">{errors.name.message}</small>
          )}
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            {...registerField("email", {
              required: "Enter your email.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            })}
            placeholder="driver@example.com"
          />
          {errors.email && (
            <small className="field-error">{errors.email.message}</small>
          )}
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            {...registerField("password", {
              required: "Enter a password.",
              minLength: { value: 8, message: "Use at least 8 characters." },
            })}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
          {errors.password && (
            <small className="field-error">{errors.password.message}</small>
          )}
        </label>
        <label>
          Confirm password
          <input
            name="confirm"
            type="password"
            {...registerField("confirm", {
              required: "Confirm your password.",
              validate: (value, values) =>
                value === values.password || "The passwords do not match.",
            })}
            autoComplete="new-password"
            placeholder="Repeat password"
          />
          {errors.confirm && (
            <small className="field-error">{errors.confirm.message}</small>
          )}
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary-button full-button" disabled={busy}>
          {busy ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}
        </button>
      </form>
      <p className="form-switch">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </Shell>
  );
}

// account is a protected screen. signing out dispatches an action that clears
// the redux user; the store subscription then removes the saved session.
export function AccountPage() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  if (!user)
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: { pathname: "/account" } }}
      />
    );
  return (
    <main className="store-page account-dashboard">
      <div className="page-intro">
        <span className="eyebrow">DRIVER PROFILE</span>
        <h1>WELCOME, {user.name.toUpperCase()}.</h1>
        <p>{user.email} · Session saved on this device</p>
      </div>
      <div className="account-dashboard-grid">
        <section className="account-panel">
          <span className="eyebrow">GARAGE</span>
          <h2>YOUR RCVERSE PROFILE</h2>
          <p>Your mock user profile is managed by JSON Server.</p>
          <Link className="primary-button" to="/products">
            EXPLORE PRODUCTS
          </Link>
        </section>
        <section className="account-panel">
          <span className="eyebrow">QUICK ACCESS</span>
          <h2>YOUR COLLECTIONS</h2>
          <div className="account-quicklinks">
            <Link to="/orders">My orders</Link>
            <Link to="/cart">Shopping cart</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
          <button className="logout-button" onClick={() => dispatch(signOut())}>
            SIGN OUT
          </button>
        </section>
      </div>
    </main>
  );
}

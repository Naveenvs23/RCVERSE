import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { adminSignIn } from "../../store/slices/authSlice";
import "./AdminLogin.css";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  const submit = async ({ email, password }) => {
    setApiError("");
    try {
      await dispatch(adminSignIn({ email, password })).unwrap();
      navigate("/admin", { replace: true });
    } catch (error) {
      setApiError(error?.message || "Unable to sign in.");
    }
  };
  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <span className="admin-eyebrow">RCVERSE / ADMIN CONTROL ROOM</span>
        <h1>Administrator sign in</h1>
        <p>
          Use the course demo administrator account to manage the JSON Server
          catalogue.
        </p>
        {apiError && (
          <p className="admin-alert" role="alert">
            {apiError}
          </p>
        )}
        <form className="admin-form" noValidate onSubmit={handleSubmit(submit)}>
          <label>
            Email address
            <input
              type="email"
              autoComplete="username"
              {...register("email", {
                required: "Enter your email.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email.",
                },
              })}
            />
            {errors.email && (
              <small className="field-error">{errors.email.message}</small>
            )}
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              {...register("password", { required: "Enter your password." })}
            />
            {errors.password && (
              <small className="field-error">{errors.password.message}</small>
            )}
          </label>
          <div className="admin-form-actions">
            <button className="admin-button primary" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>
        <div className="admin-demo-note">
          <strong>Demo only:</strong> admin@rcverse.demo / admin1234. JSON
          Server authentication is not production security.
        </div>
        <p>
          <Link to="/">Return to storefront</Link>
        </p>
      </section>
    </main>
  );
}

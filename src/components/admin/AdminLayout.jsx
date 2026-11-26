import { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { signOut, validateSession } from "../../store/slices/authSlice";
import { useEffect } from "react";
import "../../styles/admin.css";

export function AdminRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const sessionStatus = useSelector((state) => state.auth.sessionStatus);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && sessionStatus === "unverified")
      dispatch(validateSession(user.id));
  }, [dispatch, sessionStatus, user]);
  if (!user) return <Navigate to="/admin/login" replace />;
  if (sessionStatus === "unverified" || sessionStatus === "validating")
    return (
      <main className="admin-main">
        <div className="admin-state">Verifying administrator session…</div>
      </main>
    );
  if (sessionStatus !== "verified" || user.role !== "admin")
    return (
      <Navigate to={user.role === "admin" ? "/admin/login" : "/"} replace />
    );
  return children;
}

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch(signOut());
    navigate("/admin/login", { replace: true });
  };
  return (
    <div className="admin-shell">
      <AdminSidebar
        open={menuOpen}
        onNavigate={() => setMenuOpen(false)}
        onLogout={logout}
      />
      <div className="admin-workspace">
        <AdminHeader
          user={user}
          onLogout={logout}
          onMenu={() => setMenuOpen((open) => !open)}
        />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

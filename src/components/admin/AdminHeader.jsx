import { Menu, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";

const titles = {
  "/admin": "Dashboard",
  "/admin/products": "Product management",
  "/admin/users": "User management",
  "/admin/orders": "Order management",
};

export default function AdminHeader({ user, onLogout, onMenu }) {
  const { pathname } = useLocation();
  const title = pathname.startsWith("/admin/orders/")
    ? "Order details"
    : titles[pathname] || "Admin";
  return (
    <header className="admin-header">
      <button
        className="admin-menu-button"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>
      <div>
        <span className="admin-eyebrow">RCVERSE / ADMINISTRATION</span>
        <h1>{title}</h1>
      </div>
      <div className="admin-identity">
        <span className="admin-role">ADMIN</span>
        <strong>{user?.name}</strong>
        <button aria-label="Log out" onClick={onLogout}>
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}

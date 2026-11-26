import { NavLink } from "react-router-dom";
import { Gauge, Package, Users, ClipboardList, LogOut } from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: Gauge, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export default function AdminSidebar({ onLogout, open, onNavigate }) {
  return (
    <>
      {open && (
        <button
          className="admin-drawer-backdrop"
          aria-label="Close navigation"
          onClick={onNavigate}
        />
      )}
      <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
        <NavLink className="admin-brand" to="/admin" onClick={onNavigate}>
          RCVERSE <small>CONTROL ROOM</small>
        </NavLink>
        <nav aria-label="Admin navigation">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onNavigate}>
              <Icon size={17} /> <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="admin-nav-logout" onClick={onLogout}>
          <LogOut size={17} /> Logout
        </button>
      </aside>
    </>
  );
}

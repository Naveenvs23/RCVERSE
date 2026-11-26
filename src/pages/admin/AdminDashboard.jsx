import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/slices/productsSlice";
import { fetchUsers } from "../../store/slices/usersSlice";
import { fetchAllOrders } from "../../store/slices/ordersSlice";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminStatCard,
  AdminTable,
} from "../../components/admin/AdminPrimitives";
import { money, dateLabel, userForOrder } from "./adminUtils";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const users = useSelector((state) => state.users);
  const orders = useSelector((state) => state.orders);
  useEffect(() => {
    if (products.status === "idle") dispatch(fetchProducts());
    if (users.status === "idle") dispatch(fetchUsers());
    if (orders.adminStatus === "idle") dispatch(fetchAllOrders());
  }, [dispatch, products.status, users.status, orders.adminStatus]);
  const loading =
    products.status === "loading" ||
    users.status === "loading" ||
    orders.adminStatus === "loading";
  const failed =
    products.status === "failed" ||
    users.status === "failed" ||
    orders.adminStatus === "failed";
  const error = products.error || users.error || orders.adminError;
  const retry = () => {
    dispatch(fetchProducts());
    dispatch(fetchUsers());
    dispatch(fetchAllOrders());
  };
  if (
    loading &&
    !products.items.length &&
    !users.items.length &&
    !orders.adminItems.length
  )
    return <AdminLoadingState label="Loading dashboard records…" />;
  if (
    failed &&
    !products.items.length &&
    !users.items.length &&
    !orders.adminItems.length
  )
    return <AdminErrorState message={error} onRetry={retry} />;
  const customers = users.items.filter(
    (user) => (user.role || "customer") !== "admin",
  );
  const sales = orders.adminItems.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );
  const rows = orders.adminItems.slice(0, 5).map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber || `#${order.id}`,
    customer: userForOrder(order, users.items),
    date: dateLabel(order.createdAt),
    total: money(order.total),
    status: order.status || "Order Placed",
    action: (
      <Link className="admin-link-button" to={`/admin/orders/${order.id}`}>
        View
      </Link>
    ),
  }));
  return (
    <section className="admin-dashboard-page">
      {failed && (
        <div className="admin-alert" role="alert">
          Some dashboard records could not load: {error}{" "}
          <button className="admin-link-button" onClick={retry}>
            Retry
          </button>
        </div>
      )}
      <div className="admin-page-heading">
        <div>
          <h2>Store overview</h2>
          <p>Live summary from the JSON Server records.</p>
        </div>
        <button className="admin-button" onClick={retry}>
          Refresh data
        </button>
      </div>
      <div className="admin-stat-grid">
        <AdminStatCard
          label="Products"
          value={products.items.length}
          note="Catalogue records"
        />
        <AdminStatCard
          label="Customers"
          value={customers.length}
          note="Administrator accounts excluded"
        />
        <AdminStatCard
          label="Orders"
          value={orders.adminItems.length}
          note="All saved orders"
        />
        <AdminStatCard
          label="Recorded sales"
          value={money(sales)}
          note="Sum of saved order totals"
        />
      </div>
      <section className="admin-list-card">
        <div className="admin-section-title">
          <h2>Recent orders</h2>
          <Link to="/admin/orders">View all</Link>
        </div>
        <AdminTable
          columns={[
            { key: "orderNumber", label: "Order" },
            { key: "customer", label: "Customer" },
            { key: "date", label: "Date" },
            { key: "total", label: "Total" },
            { key: "status", label: "Status" },
            { key: "action", label: "" },
          ]}
          rows={rows}
          emptyTitle="No saved orders yet."
        />
      </section>
    </section>
  );
}

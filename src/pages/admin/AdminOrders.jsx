import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, fetchOrderById } from "../../store/slices/ordersSlice";
import { fetchUsers } from "../../store/slices/usersSlice";
import ProductImage from "../../components/ProductImage";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPagination,
  AdminTable,
} from "../../components/admin/AdminPrimitives";
import { dateLabel, money, userForOrder } from "./adminUtils";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const {
    adminItems: orders,
    adminStatus,
    adminError,
  } = useSelector((state) => state.orders);
  const users = useSelector((state) => state.users.items);
  const usersStatus = useSelector((state) => state.users.status);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    if (adminStatus === "idle") dispatch(fetchAllOrders());
    if (usersStatus === "idle") dispatch(fetchUsers());
  }, [dispatch, adminStatus, usersStatus]);
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(orders.length / pageSize)),
  );
  const visible = useMemo(
    () => orders.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [orders, currentPage, pageSize],
  );
  const columns = [
    {
      key: "number",
      label: "Order",
      render: (order) => order.orderNumber || `#${order.id}`,
    },
    {
      key: "customer",
      label: "Customer",
      render: (order) => (
        <div>
          {userForOrder(order, users)}
          <small className="admin-cell-subtext">
            {order.shippingInfo?.email ||
              users.find((user) => String(user.id) === String(order.userId))
                ?.email ||
              ""}
          </small>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (order) => dateLabel(order.createdAt),
    },
    { key: "total", label: "Total", render: (order) => money(order.total) },
    {
      key: "paymentMethod",
      label: "Payment",
      render: (order) => order.paymentMethod || "—",
    },
    {
      key: "paymentStatus",
      label: "Payment status",
      render: (order) => order.paymentStatus || "—",
    },
    {
      key: "status",
      label: "Order status",
      render: (order) => order.status || "Order Placed",
    },
    {
      key: "view",
      label: "",
      render: (order) => (
        <Link className="admin-link-button" to={`/admin/orders/${order.id}`}>
          View details
        </Link>
      ),
    },
  ];
  if (adminStatus === "loading" && !orders.length)
    return <AdminLoadingState label="Loading orders…" />;
  if (adminStatus === "failed" && !orders.length)
    return (
      <AdminErrorState
        message={adminError}
        onRetry={() => dispatch(fetchAllOrders())}
      />
    );
  return (
    <section>
      <div className="admin-page-heading">
        <div>
          <h2>Orders</h2>
          <p>All saved orders, newest first.</p>
        </div>
        <button
          className="admin-button"
          onClick={() => dispatch(fetchAllOrders())}
        >
          Refresh
        </button>
      </div>
      {orders.length ? (
        <>
          <AdminTable columns={columns} rows={visible} />
          <AdminPagination
            page={currentPage}
            pageSize={pageSize}
            total={orders.length}
            onPage={setPage}
            onPageSize={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </>
      ) : (
        <AdminEmptyState title="No orders have been placed yet." />
      )}
    </section>
  );
}

export function AdminOrderDetail() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const order = useSelector(
    (state) =>
      state.orders.adminItems.find((item) => String(item.id) === orderId) ||
      (String(state.orders.selected?.id) === orderId
        ? state.orders.selected
        : null),
  );
  const status = useSelector((state) => state.orders.detailStatus);
  const error = useSelector((state) => state.orders.error);
  const users = useSelector((state) => state.users.items);
  useEffect(() => {
    if (!order) dispatch(fetchOrderById(orderId));
    if (!users.length) dispatch(fetchUsers());
  }, [dispatch, order, orderId, users.length]);
  if (!order && status === "loading")
    return <AdminLoadingState label="Loading order details…" />;
  if (!order && status === "failed")
    return (
      <AdminErrorState
        message={error || "Order not found."}
        onRetry={() => dispatch(fetchOrderById(orderId))}
      />
    );
  if (!order) return <AdminEmptyState title="Order not found." />;
  const fields = [
    ["Order number", order.orderNumber || order.id],
    ["Customer", userForOrder(order, users)],
    ["Email", order.shippingInfo?.email || "—"],
    ["Order date", dateLabel(order.createdAt)],
    ["Payment method", order.paymentMethod || "—"],
    ["Payment status", order.paymentStatus || "—"],
    ["Current status", order.status || "Order Placed"],
    ["Street address", order.shippingInfo?.address || "—"],
    ["City", order.shippingInfo?.city || "—"],
    ["PIN code", order.shippingInfo?.pin || "—"],
    ["Subtotal", money(order.subtotal)],
    ["Shipping", money(order.shipping)],
    ["Tax", money(order.tax)],
    ["Total", money(order.total)],
  ];
  return (
    <section>
      <div className="admin-page-heading">
        <div>
          <h2>Order {order.orderNumber || `#${order.id}`}</h2>
          <p>Read-only order record and shipping snapshot.</p>
        </div>
        <Link className="admin-button" to="/admin/orders">
          Back to orders
        </Link>
      </div>
      <div className="admin-detail-grid">
        <section className="admin-panel">
          <h2>Order details</h2>
          <div className="admin-detail-list">
            {fields.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="admin-panel">
          <h2>Tracking history</h2>
          {order.trackingHistory?.length ? (
            <ol className="admin-tracking">
              {order.trackingHistory.map((event, index) => (
                <li key={`${event.status}-${event.date}-${index}`}>
                  <strong>{event.status}</strong>
                  <span>{dateLabel(event.date)}</span>
                </li>
              ))}
            </ol>
          ) : (
            <AdminEmptyState title="No tracking events recorded." />
          )}
        </section>
      </div>
      <section className="admin-list-card">
        <h2>Products in order</h2>
        {order.items?.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Unit price</th>
                  <th>Line total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-product-cell">
                        <ProductImage product={item} />
                        <strong>{item.name}</strong>
                      </div>
                    </td>
                    <td>{item.sku || "—"}</td>
                    <td>{item.quantity}</td>
                    <td>{money(item.price)}</td>
                    <td>{money(Number(item.price) * Number(item.quantity))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmptyState title="This order has no item details." />
        )}
      </section>
    </section>
  );
}

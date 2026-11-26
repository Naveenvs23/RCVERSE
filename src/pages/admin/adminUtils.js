export const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const dateLabel = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString("en-IN");
};

export const userForOrder = (order, users) => {
  const user = users.find((item) => String(item.id) === String(order.userId));
  return (
    user?.name ||
    order.shippingInfo?.name ||
    user?.email ||
    `Customer ${order.userId || "unknown"}`
  );
};

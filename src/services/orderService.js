import { apiRequest } from "./api";

// these small functions map order actions to json server endpoints.
export const placeOrder = (order) =>
  apiRequest("/orders", { method: "POST", body: JSON.stringify(order) });
export const getOrders = (userId) =>
  apiRequest(`/orders?userId=${encodeURIComponent(userId)}&_sort=-createdAt`);
export const getAllOrders = () => apiRequest("/orders?_sort=-createdAt");
export const getOrder = (id) => apiRequest(`/orders/${encodeURIComponent(id)}`);
export const updateOrder = (id, changes) =>
  apiRequest(`/orders/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
export async function getOrderByNumber(orderNumber) {
  // json server returns a list for a field search, so use the first match or null.
  const orders = await apiRequest(
    `/orders?orderNumber=${encodeURIComponent(orderNumber)}`,
  );
  return Array.isArray(orders) ? orders[0] || null : orders.data?.[0] || null;
}

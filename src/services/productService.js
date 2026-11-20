import { apiRequest } from "./api";

const queryString = (params = {}) => {
  const query = new URLSearchParams();
  const normalized={...params};
  if(normalized.page!==undefined){normalized._page=normalized.page;delete normalized.page;}
  if(normalized.perPage!==undefined){normalized._per_page=normalized.perPage;delete normalized.perPage;}
  if(normalized.search!==undefined){normalized.q=normalized.search;delete normalized.search;}
  for (const [key, value] of Object.entries(normalized)) if (value !== undefined && value !== null && value !== "") query.set(key, value);
  return query.size ? `?${query}` : "";
};

export const getProducts = async (params = {}) => {
  const response=await apiRequest(`/products${queryString(params)}`);
  const products=Array.isArray(response)?response:response?.data;
  if (!Array.isArray(products)) throw new Error("The product API returned an unexpected response.");
  return products;
};
export const getProductById = (id) => apiRequest(`/products/${encodeURIComponent(id)}`);
export const createProduct = (product) => apiRequest("/products", { method: "POST", body: JSON.stringify(product) });
export const updateProduct = (id, changes) => apiRequest(`/products/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(changes) });
export const deleteProduct = (id) => apiRequest(`/products/${encodeURIComponent(id)}`, { method: "DELETE" });

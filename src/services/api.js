import axios from "axios";

// one axios client keeps the api address and json headers consistent for every
// service. vite reads its optional api url from the local environment file.
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  headers: { "Content-Type": "application/json" },
});

// Keep the service functions small: callers get response data or a readable error.
export async function apiRequest(path, options = {}) {
  try {
    const requestOptions = { ...options };
    if (requestOptions.body !== undefined) {
      requestOptions.data =
        typeof requestOptions.body === "string"
          ? JSON.parse(requestOptions.body)
          : requestOptions.body;
      delete requestOptions.body;
    }
    const response = await api.request({ url: path, ...requestOptions });
    return response.data;
  } catch (error) {
    if (!error.response) {
      throw new Error(
        `Cannot reach the RCVERSE API at ${api.defaults.baseURL}. Start JSON Server with “npm run server” or both services with “npm run dev:all”, then retry.`,
        { cause: error },
      );
    }
    const message =
      error.response?.data?.message || error.response?.data || error.message;
    throw new Error(
      typeof message === "string" ? message : "The mock API request failed.",
      { cause: error },
    );
  }
}

export default api;

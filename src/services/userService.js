import { apiRequest } from "./api";

// registration checks for a duplicate email before saving the mock account.
// email is encoded for the url and saved in lowercase for consistent matching.
export async function registerUser(user) {
  const email = encodeURIComponent(user.email.toLowerCase());
  const matches = await apiRequest(`/users?email=${email}`);
  if (matches.length) throw new Error("An account with this email already exists.");
  return apiRequest("/users", { method: "POST", body: JSON.stringify({ ...user, email: user.email.toLowerCase() }) });
}

export async function loginUser({ email, password }) {
  // this is a course demo: it compares the submitted password with json server
  // data directly and is not a secure authentication system.
  const matches = await apiRequest(`/users?email=${encodeURIComponent(email.toLowerCase())}`);
  const user = matches.find((item) => item.password === password);
  if (!user) throw new Error("Email or password is incorrect.");
  return user;
}

export const getUser = (id) => apiRequest(`/users/${id}`);
export const updateUser = (id, changes) => apiRequest(`/users/${id}`, { method: "PATCH", body: JSON.stringify(changes) });
export const deleteUser = (id) => apiRequest(`/users/${id}`, { method: "DELETE" });

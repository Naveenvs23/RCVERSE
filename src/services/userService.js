import { apiRequest } from "./api";

const safeUser = (user) => {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => key !== "password"),
  );
};

export const getUsers = async () => (await apiRequest("/users")).map(safeUser);

// registration checks for a duplicate email before saving the mock account.
// email is encoded for the url and saved in lowercase for consistent matching.
export async function registerUser(user) {
  const email = encodeURIComponent(user.email.toLowerCase());
  const matches = await apiRequest(`/users?email=${email}`);
  if (matches.length)
    throw new Error("An account with this email already exists.");
  const created = await apiRequest("/users", {
    method: "POST",
    body: JSON.stringify({
      name: user.name,
      email: user.email.toLowerCase(),
      password: user.password,
      role: "customer",
      isBlocked: false,
      createdAt: new Date().toISOString(),
    }),
  });
  return safeUser(created);
}

export async function loginUser({
  email,
  password,
  expectedRole = "customer",
}) {
  // this is a course demo: it compares the submitted password with json server
  // data directly and is not a secure authentication system.
  const matches = await apiRequest(
    `/users?email=${encodeURIComponent(email.toLowerCase())}`,
  );
  const user = matches.find(
    (item) =>
      item.password === password && (item.role || "customer") === expectedRole,
  );
  if (!user) throw new Error("Email or password is incorrect.");
  if (user.isBlocked)
    throw new Error(
      "This account is blocked. Contact the store administrator.",
    );
  return safeUser({ ...user, role: user.role || "customer" });
}

export const getUser = (id) => apiRequest(`/users/${encodeURIComponent(id)}`);
export const updateUser = (id, changes) =>
  apiRequest(`/users/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  }).then(safeUser);
export const deleteUser = (id) =>
  apiRequest(`/users/${id}`, { method: "DELETE" });

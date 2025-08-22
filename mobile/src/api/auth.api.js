import { api } from "./client";

/** Register a new user → { token, user } */
export async function register({ name, email, password }) {
  const { data } = await api.post("/api/v1/auth/register", { name, email, password });
  return data;
}

/** Login → { token, user } */
export async function login({ email, password }) {
  const { data } = await api.post("/api/v1/auth/login", { email, password });
  return data;
}

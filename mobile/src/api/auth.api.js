import { api } from "./client";
export async function register({ name, email, password }) {
  const { data } = await api.post("/api/v1/auth/register", { name, email, password });
  return data;
}
export async function login({ email, password }) {
  const { data } = await api.post("/api/v1/auth/login", { email, password });
  return data;
}

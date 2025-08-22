import { create } from "zustand";
import * as Auth from "../api/auth.api";

export const useAuthStore = create((set) => ({
  user: null, token: null,
  async login(email, password) { const { token, user } = await Auth.login({ email, password }); set({ token, user }); return user; },
  async register(name, email, password) { const { token, user } = await Auth.register({ name, email, password }); set({ token, user }); return user; },
  logout() { set({ user: null, token: null }); },
}));

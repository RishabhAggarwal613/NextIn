import { create } from "zustand";
import * as Auth from "../api/auth.api";
import { setAuthToken } from "../api/client";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  async register(name, email, password) {
    set({ loading: true, error: null });
    try {
      const { token, user } = await Auth.register({ name, email, password });
      setAuthToken(token);
      set({ user, token, loading: false });
      return user;
    } catch (e) {
      set({ loading: false, error: e.message || "register_failed" });
      throw e;
    }
  },

  async login(email, password) {
    set({ loading: true, error: null });
    try {
      const { token, user } = await Auth.login({ email, password });
      setAuthToken(token);
      set({ user, token, loading: false });
      return user;
    } catch (e) {
      set({ loading: false, error: e.message || "login_failed" });
      throw e;
    }
  },

  logout() {
    setAuthToken(null);
    set({ user: null, token: null });
  },
}));

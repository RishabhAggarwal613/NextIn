import axios from "axios";
import { API_BASE } from "../config/env";

let authToken = null;

/** Set/clear the JWT used for auth’d requests */
export function setAuthToken(token) {
  authToken = token || null;
}

/** Create a preconfigured axios instance */
export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

/** Attach Authorization header when we have a token */
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

/** Normalize errors */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.error || err.message || "network_error";
    const status = err?.response?.status;
    const error = new Error(msg);
    error.status = status;
    throw error;
  }
);

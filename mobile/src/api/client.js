import axios from "axios";
import { API_BASE } from "../config/env";

export const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg = err?.response?.data?.error || err.message;
    console.warn("[api]", msg);
    throw err;
  }
);

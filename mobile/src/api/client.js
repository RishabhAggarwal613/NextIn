import axios from "axios";
import Constants from "expo-constants";

// Read API URL from app.json → extra
const { API_URL } = Constants.expoConfig.extra;

// Create axios instance
export const api = axios.create({ baseURL: API_URL });

// Token storage (in-memory; you can persist to AsyncStorage later)
let _token = null;

export const setToken = (t) => {
  _token = t;
};

// Attach token automatically to requests
api.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`;
  }
  return config;
});

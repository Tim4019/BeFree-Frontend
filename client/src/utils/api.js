import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "http://localhost:5005/api";
const normalizedBase = (() => {
  const trimmed = rawBase.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
})();

const api = axios.create({
  baseURL: normalizedBase,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

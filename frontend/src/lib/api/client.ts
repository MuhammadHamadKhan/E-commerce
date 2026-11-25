// One shared axios instance keeps API requests and error handling together.
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10_000, // give up after 10 seconds
});

// Let the browser set the multipart boundary and mark bodyless writes as JSON.
api.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase();
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  } else if (
    ["POST", "PUT", "PATCH", "DELETE"].includes(method || "") &&
    config.data
  ) {
    config.headers.set("Content-Type", "application/json");
  }
  return config;
});

// A clean error object we can show in the interface.
export class ApiError extends Error {
  status?: number; // HTTP status code (undefined = network problem)
  details?: unknown; // original axios error, for debugging

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// ---- response interceptor: turn every failure into a clean ApiError ----
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    // The backend always answers errors with { success: false, message }
    const backendMessage =
      (error.response?.data as { message?: string } | undefined)?.message;

    const message = backendMessage || "Network error, please try again";

    const url = error.config?.url || "";
    const isProtectedRequest = /\/(?:auth\/bakery\/me|bakery\/)/.test(url);
    if (status === 401 && isProtectedRequest) {
      logoutHandler?.(); // set by setupInterceptors(store)
    }

    return Promise.reject(new ApiError(message, status, error));
  }
);

// The Redux "logout" action, filled in once by setupInterceptors.
let logoutHandler: (() => void) | null = null;

// Called ONCE when the Redux store is created (in store.js).
// This avoids a circular import: client does not import the store,
// the store hands its logout action to the client instead.
export function setupInterceptors(logout: () => void): void {
  logoutHandler = logout;
}

// ---- small helpers: return response.data directly ----
export async function get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.get<T>(url, config);
  return res.data;
}

export async function post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.post<T>(url, data, config);
  return res.data;
}

export async function put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.put<T>(url, data, config);
  return res.data;
}

export async function patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.patch<T>(url, data, config);
  return res.data;
}

export async function del<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.delete<T>(url, { ...config, data: {} });
  return res.data;
}

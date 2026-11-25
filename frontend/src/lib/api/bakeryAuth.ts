// Bakery owner authentication endpoints.
import { get, post } from "./client";
import type { AuthResponse, MeResponse, MessageResponse } from "./types";

// Body for POST /api/auth/bakery/register (all fields required)
export interface RegisterBakeryInput {
  owner_name: string;
  email: string;
  password: string;
  phone: string;
  bakery_name: string;
  address: string;
  city: string;
}

export interface LoginBakeryInput {
  email: string;
  password: string;
}

// POST /api/auth/bakery/register -> { user, bakery } + HttpOnly cookie
export function registerBakery(data: RegisterBakeryInput) {
  return post<AuthResponse>("/auth/bakery/register", data);
}

// POST /api/auth/bakery/login -> { user, bakery } + HttpOnly cookie
export function loginBakery(data: LoginBakeryInput) {
  return post<AuthResponse>("/auth/bakery/login", data);
}

export function logoutBakery() {
  return post<MessageResponse>("/auth/bakery/logout", {});
}

// GET /api/auth/bakery/me (cookie sent automatically by the browser)
export function getBakeryMe() {
  return get<MeResponse>("/auth/bakery/me");
}

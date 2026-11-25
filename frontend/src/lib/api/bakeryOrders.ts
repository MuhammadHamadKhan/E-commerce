// Bakery owner order endpoints (all need login).
import { get, patch } from "./client";
import type { Order, OrdersResponse } from "./types";

export interface MyOrderFilters {
  status?: "pending" | "confirmed" | "picked_up" | "cancelled" | "expired";
}

// GET /api/bakery/orders?status= - orders containing MY items, newest first
export function getMyOrders(filters: MyOrderFilters = {}) {
  return get<OrdersResponse>("/bakery/orders", { params: filters });
}

// GET /api/bakery/orders/:id
export function getMyOrder(id: number | string) {
  return get<{ success: boolean; order: Order }>(`/bakery/orders/${id}`);
}

// GET /api/bakery/orders/pickup/:code - check a customer's code at the counter
export function findMyOrderByPickupCode(code: string) {
  return get<{ success: boolean; order?: Order; message?: string }>(
    `/bakery/orders/pickup/${encodeURIComponent(code)}`
  );
}

// PATCH /api/bakery/orders/:id/status
export function updateMyOrderStatus(
  id: number | string,
  status: "pending" | "confirmed" | "picked_up" | "cancelled" | "expired"
) {
  return patch<{ success: boolean; message: string; order: { id: number; status: string } }>(
    `/bakery/orders/${id}/status`,
    { status }
  );
}
export type { Order };

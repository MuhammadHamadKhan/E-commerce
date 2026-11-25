// Public customer order endpoints (guest checkout allowed).
import { get, post } from "./client";
import type { Order, PickupOrderResponse } from "./types";

// Body for POST /api/orders (guest checkout: no token needed)
export interface PlaceOrderInput {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: { listing_id: number; quantity: number }[];
}

// POST /api/orders - the backend answers 201 { order }
export function placeOrder(orderData: PlaceOrderInput) {
  return post<{ success: boolean; message: string; order: Order }>("/orders", orderData);
}

// GET /api/orders/pickup/:code - public status check by pickup code
export function getOrderByCode(code: string) {
  return get<PickupOrderResponse>(`/orders/pickup/${encodeURIComponent(code)}`);
}

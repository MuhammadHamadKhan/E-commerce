// Public bakery endpoints (no login needed).
import { get } from "./client";
import type { Bakery, BakeriesResponse, BakeryDetailsResponse, Listing } from "./types";

// GET /api/bakeries?search=&city=&page=&limit= - all registered bakeries (paginated)
// ?search= matches bakery name or city (partial, case-insensitive).
export function getBakeries(filters: {
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}) {
  return get<BakeriesResponse>("/bakeries", { params: filters });
}

// GET /api/bakeries/:id - one bakery + its active listings
export function getBakery(id: number | string) {
  return get<BakeryDetailsResponse>(`/bakeries/${id}`);
}
export type { Bakery, Listing };

// Bakery owner listing endpoints (all need login).
import { del, get, post, put } from "./client";
import type { MessageResponse, MyListing, MyListingResponse, MyListingsResponse } from "./types";

// GET /api/bakery/listings?status=active|expired|soldout (status optional)
export function getMyListings(filters: { status?: "active" | "expired" | "soldout" } = {}) {
  return get<MyListingsResponse>("/bakery/listings", { params: filters });
}

// POST /api/bakery/listings - offer one of MY products at a discount
export interface ListingInput {
  product_id: number;
  discounted_price: number;
  quantity_left: number;
  available_from?: string; // optional, backend defaults to now
  expires_at: string; // must be in the future
}

export function createMyListing(data: ListingInput) {
  return post<MyListingResponse>("/bakery/listings", data);
}

// PUT /api/bakery/listings/:id - edit price, quantity and times
export function updateMyListing(
  id: number | string,
  data: Partial<Omit<ListingInput, "product_id">>
) {
  return put<MyListingResponse>(`/bakery/listings/${id}`, data);
}

// DELETE /api/bakery/listings/:id (blocked while orders exist)
export function deleteMyListing(id: number | string) {
  return del<MessageResponse>(`/bakery/listings/${id}`);
}
export type { MyListing };

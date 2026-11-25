// Public listing endpoints (no login needed). Plain functions only -
// no React Query, no Redux. Filters go as axios "params".
import { get } from "./client";
import type { Listing, ListingsResponse } from "./types";

// Filters for GET /api/listings (all optional, backend has defaults)
export interface ListingFilters {
  city?: string;
  search?: string;
  sort?: "price_asc" | "price_desc" | "ending_soon" | "biggest_discount";
  page?: number;
  limit?: number;
}

// GET /api/listings?city=&search=&sort=&page=&limit=
export function getListings(filters: ListingFilters = {}) {
  return get<ListingsResponse>("/listings", { params: filters });
}

// GET /api/listings/:id - one active listing (404 if expired/gone)
export function getListing(id: number | string) {
  return get<{ success: boolean; listing: Listing }>(`/listings/${id}`);
}

// GET /api/browse - discovery page: ending soon, biggest discounts, bakeries
export interface BrowseResponse {
  success: boolean;
  search: string;
  sections: {
    ending_soon: Listing[];
    biggest_discounts: Listing[];
    bakeries: {
      id: number;
      name: string;
      address: string;
      city: string;
      phone: string;
      active_listing_count: number;
      listings: Listing[];
    }[];
  };
}

export function getBrowse(filters: { search?: string } = {}) {
  return get<BrowseResponse>("/browse", { params: filters });
}

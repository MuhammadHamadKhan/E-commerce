// One place that defines every React Query key, so pages and mutations
// always point at the same cached data. Keep the shapes simple:
// arrays of strings/values, built from ids and filters.
import type { ListingFilters } from "@/lib/api/listings";
import type { MyOrderFilters } from "@/lib/api/bakeryOrders";

export const queryKeys = {
  // public listings feed
  listings: {
    all: ["listings"] as const,
    list: (filters: ListingFilters) => ["listings", "list", filters] as const,
    detail: (id: number | string) => ["listings", "detail", id] as const,
  },
  // public bakeries
  bakeries: {
    all: ["bakeries"] as const,
    list: (
      city?: string,
      search?: string,
      page?: number,
      limit?: number
    ) => ["bakeries", "list", city ?? null, search ?? null, page ?? 1, limit ?? 12] as const,
    detail: (id: number | string) => ["bakeries", "detail", id] as const,
  },
  // customer order lookup by pickup code
  orders: {
    byCode: (code: string) => ["orders", "pickup", code] as const,
  },
  // logged-in bakery owner area
  bakery: {
    me: ["bakery", "me"] as const,
    products: {
      all: ["bakery", "products"] as const,
      detail: (id: number | string) => ["bakery", "products", id] as const,
    },
    listings: {
      all: ["bakery", "listings"] as const,
      list: (status?: string) => ["bakery", "listings", status ?? null] as const,
    },
    orders: {
      all: ["bakery", "orders"] as const,
      list: (filters: MyOrderFilters) => ["bakery", "orders", filters] as const,
      detail: (id: number | string) => ["bakery", "orders", id] as const,
    },
    profile: ["bakery", "profile"] as const,
  },
};

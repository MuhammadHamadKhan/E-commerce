// Shared constants. Order statuses exactly as the backend uses them,
// with friendly labels for the interface.
export const ORDER_STATUSES = ["pending", "confirmed", "picked_up", "cancelled", "expired"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

// status value -> text shown to the user
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  picked_up: "Picked up",
  cancelled: "Cancelled",
  expired: "Expired",
};

// Which moves the backend allows (PATCH /api/bakery/orders/:id/status)
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "yellow",
  confirmed: "blue",
  picked_up: "green",
  cancelled: "red",
  expired: "gray",
};

// Sort options for the listings feed (validated by the backend)
export const LISTING_SORTS = [
  { value: "ending_soon", label: "Ending soon" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "biggest_discount", label: "Biggest discount" },
] as const;

export const CITIES = ["Peshawar"]; // Peshawar neighborhood bakeries

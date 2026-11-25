// Types describing what the backend sends back. Kept in one place so
// hooks and components can share them.

// A row from GET /api/listings (active listing feed)
export interface Listing {
  id: number;
  product_name: string;
  description: string | null;
  image_url: string | null;
  bakery_id: number;
  bakery_name: string;
  city: string;
  original_price: string; // Postgres NUMERIC arrives as a string
  discounted_price: string;
  discount_percent: string;
  quantity_left: number;
  expires_at: string;
}

// GET /api/listings response
export interface ListingsResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  listings: Listing[];
}

// GET /api/bakeries/:id response
export interface Bakery {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
}

export interface BakeriesResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  limit: number;
  bakeries: Bakery[];
}

export interface BakeryDetailsResponse {
  success: boolean;
  bakery: Bakery;
  active_listings: Listing[];
}

// GET /api/orders/pickup/:code response
export interface PickupOrder {
  pickup_code: string;
  status: string;
  total_price: string;
  created_at: string;
  customer_first_name?: string;
  customer_phone_masked?: string;
  items?: {
    product_name: string;
    quantity: number;
    price_at_purchase: string;
    line_total: string;
    bakery_name: string;
    bakery_address: string;
  }[];
}

export interface PickupOrderResponse {
  success: boolean;
  message?: string;
  order: PickupOrder;
}

// POST /api/orders response (also used by bakery order routes)
export interface Order {
  id: number;
  pickup_code: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string | null;
  status: string;
  total_price: string;
  created_at: string;
  items?: {
    order_item_id?: number;
    listing_id?: number;
    product_name: string;
    quantity: number;
    price_at_purchase: string;
    line_total?: string;
  }[];
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  orders: Order[];
}

// auth/bakery: register and login set an HttpOnly cookie and return user + bakery
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  bakery: Bakery | null;
}

export interface MeResponse {
  success: boolean;
  user: AuthUser;
  bakery: Bakery | null;
}

// bakery products
export interface Product {
  id: number;
  bakery_id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  original_price: string;
  created_at: string;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  products: Product[];
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

// bakery listings
export interface MyListing {
  id: number;
  product_id: number;
  product_name: string;
  original_price: string;
  discounted_price: string;
  discount_percent: string;
  quantity_left: number;
  available_from: string;
  expires_at: string;
  created_at: string;
}

export interface MyListingsResponse {
  success: boolean;
  count: number;
  listings: MyListing[];
}

export interface MyListingResponse {
  success: boolean;
  message: string;
  listing: MyListing;
}

// generic "success + message" answer (delete, status change, ...)
export interface MessageResponse {
  success: boolean;
  message: string;
}

// bakery profile (GET /api/bakery/profile)
export interface ProfileResponse {
  success: boolean;
  bakery: Bakery;
}

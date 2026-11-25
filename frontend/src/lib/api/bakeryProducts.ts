// Bakery owner product endpoints (the browser sends the auth cookie).
import { del, get, post, put } from "./client";
import type { MessageResponse, Product, ProductResponse, ProductsResponse } from "./types";

// GET /api/bakery/products - all products of MY bakery
export function getMyProducts() {
  return get<ProductsResponse>("/bakery/products");
}

// GET /api/bakery/products/:id
export function getMyProduct(id: number | string) {
  return get<ProductResponse>(`/bakery/products/${id}`);
}

// POST /api/bakery/products - JSON fields, or FormData with an "image" file
// for the upload. The backend also accepts image_url instead of a file.
export interface ProductInput {
  name: string;
  description?: string;
  original_price: number;
  image_url?: string;
}

export function createMyProduct(data: ProductInput | FormData) {
  return post<ProductResponse>("/bakery/products", data);
}

// PUT /api/bakery/products/:id - same body shapes as create
export function updateMyProduct(id: number | string, data: ProductInput | FormData) {
  return put<ProductResponse>(`/bakery/products/${id}`, data);
}

// DELETE /api/bakery/products/:id (blocked while listings/orders exist)
export function deleteMyProduct(id: number | string) {
  return del<MessageResponse>(`/bakery/products/${id}`);
}
export type { Product };

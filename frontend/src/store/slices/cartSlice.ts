// Redux slice for the shopping cart (CLIENT state only). Saved in
// localStorage so a refresh does not empty it, and loaded back after
// the page mounts (never during server render, to avoid hydration
// mismatch errors).
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Listing } from "@/lib/api/types";

export interface CartItem {
  listing_id: number;
  name: string;
  image_url: string | null;
  original_price: number; // price before the discount
  price: number; // discounted price at add time
  quantity: number;
  quantity_left: number; // never allow more than this
  expires_at: string;
}

interface CartState {
  bakeryId: number | null; // a cart holds items from ONE bakery only
  bakeryName: string | null;
  items: CartItem[];
  isHydrated: boolean; // true once localStorage was read after mount
}

const initialState: CartState = {
  bakeryId: null,
  bakeryName: null,
  items: [],
  isHydrated: false,
};

const CART_KEY = "lastbite_cart";

// ---- localStorage helpers (browser only) ----
function saveCartToStorage(state: CartState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CART_KEY,
      JSON.stringify({ bakeryId: state.bakeryId, bakeryName: state.bakeryName, items: state.items })
    );
  } catch {
    // ignore (private mode, quota, ...)
  }
}

function loadCartFromStorage(): { bakeryId: number | null; bakeryName: string | null; items: CartItem[] } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add one listing. Rules:
    // - the cart holds items from ONE bakery; if it belongs to another
    //   bakery we do NOT change the cart. The reducer returns state
    //   unchanged; the interface should then ask "Replace your cart?"
    //   and call replaceCartWith instead.
    addItem(state, action: PayloadAction<{ listing: Listing; bakeryId: number; bakeryName: string }>) {
      const { listing, bakeryId, bakeryName } = action.payload;

      // Different bakery and the cart is not empty -> signal the conflict
      if (state.bakeryId !== null && state.bakeryId !== bakeryId) return;

      const existing = state.items.find((item) => item.listing_id === listing.id);
      if (existing) {
        // One more, but never above quantity_left
        existing.quantity = Math.min(existing.quantity + 1, listing.quantity_left);
      } else {
        state.items.push({
          listing_id: listing.id,
          name: listing.product_name,
          image_url: listing.image_url,
          original_price: Number(listing.original_price),
          price: Number(listing.discounted_price),
          quantity: 1,
          quantity_left: listing.quantity_left,
          expires_at: listing.expires_at,
        });
      }
      state.bakeryId = bakeryId;
      state.bakeryName = bakeryName;
      saveCartToStorage(state);
    },

    // Remove one item by listing id
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.listing_id !== action.payload);
      if (state.items.length === 0) {
        state.bakeryId = null;
        state.bakeryName = null;
      }
      saveCartToStorage(state);
    },

    // Change quantity. Never below 1, never above quantity_left.
    setQuantity(state, action: PayloadAction<{ listingId: number; quantity: number }>) {
      const item = state.items.find((i) => i.listing_id === action.payload.listingId);
      if (!item) return;
      item.quantity = Math.min(Math.max(1, action.payload.quantity), item.quantity_left);
      saveCartToStorage(state);
    },

    // Keep an existing cart row synced with the latest listing and quantity.
    setListingQuantity(
      state,
      action: PayloadAction<{ listing: Listing; quantity: number; bakeryId: number; bakeryName: string }>
    ) {
      const { listing, quantity, bakeryId, bakeryName } = action.payload;
      const item = state.items.find((cartItem) => cartItem.listing_id === listing.id);
      if (!item) return;

      item.name = listing.product_name;
      item.image_url = listing.image_url;
      item.original_price = Number(listing.original_price);
      item.price = Number(listing.discounted_price);
      item.quantity_left = listing.quantity_left;
      item.expires_at = listing.expires_at;
      item.quantity = Math.min(Math.max(1, quantity), listing.quantity_left);
      state.bakeryId = bakeryId;
      state.bakeryName = bakeryName;
      saveCartToStorage(state);
    },

    // Add a listing at an explicitly selected quantity, or replace its
    // current quantity when it is already in the cart.
    addListingAtQuantity(
      state,
      action: PayloadAction<{ listing: Listing; quantity: number; bakeryId: number; bakeryName: string }>
    ) {
      const { listing, quantity, bakeryId, bakeryName } = action.payload;
      if (state.bakeryId !== null && state.bakeryId !== bakeryId) return;

      const safeQuantity = Math.min(Math.max(1, quantity), listing.quantity_left);
      const existing = state.items.find((item) => item.listing_id === listing.id);
      if (existing) {
        existing.name = listing.product_name;
        existing.image_url = listing.image_url;
        existing.original_price = Number(listing.original_price);
        existing.price = Number(listing.discounted_price);
        existing.quantity_left = listing.quantity_left;
        existing.expires_at = listing.expires_at;
        existing.quantity = safeQuantity;
      } else {
        state.items.push({
          listing_id: listing.id,
          name: listing.product_name,
          image_url: listing.image_url,
          original_price: Number(listing.original_price),
          price: Number(listing.discounted_price),
          quantity: safeQuantity,
          quantity_left: listing.quantity_left,
          expires_at: listing.expires_at,
        });
      }
      state.bakeryId = bakeryId;
      state.bakeryName = bakeryName;
      saveCartToStorage(state);
    },

    // Empty the cart (used after a successful order)
    clearCart(state) {
      state.bakeryId = null;
      state.bakeryName = null;
      state.items = [];
      saveCartToStorage(state);
    },

    // Empty the cart and fill it with items from a DIFFERENT bakery.
    // Used when the customer answers "yes" to "Replace your cart?".
    replaceCartWith(
      state,
      action: PayloadAction<{ listing: Listing; bakeryId: number; bakeryName: string; quantity?: number }>
    ) {
      const { listing, bakeryId, bakeryName } = action.payload;
      const quantity = Math.min(
        Math.max(1, action.payload.quantity ?? 1),
        listing.quantity_left
      );
      state.bakeryId = bakeryId;
      state.bakeryName = bakeryName;
      state.items = [
        {
          listing_id: listing.id,
          name: listing.product_name,
          image_url: listing.image_url,
          original_price: Number(listing.original_price),
          price: Number(listing.discounted_price),
          quantity,
          quantity_left: listing.quantity_left,
          expires_at: listing.expires_at,
        },
      ];
      saveCartToStorage(state);
    },

    // Called once after the page mounts in the browser: read the saved
    // cart back so a refresh does not empty it.
    hydrateCart(state) {
      const saved = loadCartFromStorage();
      if (saved) {
        state.bakeryId = saved.bakeryId;
        state.bakeryName = saved.bakeryName;
        state.items = saved.items;
      }
      state.isHydrated = true;
    },
  },
});

export const {
  addItem,
  removeItem,
  setQuantity,
  setListingQuantity,
  addListingAtQuantity,
  clearCart,
  replaceCartWith,
  hydrateCart,
} =
  cartSlice.actions;
export default cartSlice.reducer;

// ---- selectors: small helpers to read values out of the cart ----
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

// How many distinct products are in the cart (number of line items).
// Increases when a new product is added; stays the same when only the
// quantity of an existing product changes.
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.length;

// Total price of the cart
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Total savings: for each item, (original - discounted) * quantity
export const selectCartSavings = (state: { cart: CartState }) =>
  state.cart.items.reduce(
    (sum, item) => sum + (item.original_price - item.price) * item.quantity,
    0
  );

export const selectCartIsHydrated = (state: { cart: CartState }) => state.cart.isHydrated;
export const selectCartBakery = (state: { cart: CartState }) => ({
  bakeryId: state.cart.bakeryId,
  bakeryName: state.cart.bakeryName,
});

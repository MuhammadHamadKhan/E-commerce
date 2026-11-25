// The Redux store: holds ONLY client state (login, cart, small UI bits).
// Server data (listings, bakeries, orders) stays in React Query.
import { configureStore, type Store } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import uiReducer from "./slices/uiSlice";
import { setupInterceptors } from "@/lib/api/client";
import { logout } from "./slices/authSlice";

// Why a stub on the server? During prerendering, client components run
// on the server too. Redux's own createStore runs a reducer check that
// uses Math.random(), which Next.js forbids during prerender (it would
// bake an unstable value into the HTML). On the server no action is
// ever dispatched and nothing is interactive, so a minimal store with
// the initial state is enough; the real store is made in the browser.
function makeServerStubStore(): AppStore {
  const initialState = {
    auth: { user: null, bakery: null, status: "loading" },
    cart: { bakeryId: null, bakeryName: null, items: [], isHydrated: false },
    ui: { isMobileMenuOpen: false, isCartDrawerOpen: false },
  };

  return {
    getState: () => initialState,
    dispatch: () => ({ type: "noop" }),
    subscribe: () => () => {},
    replaceReducer: () => {},
  } as unknown as AppStore;
}

export function makeStore(): AppStore {
  // Server prerender: use the stub (see the comment above).
  if (typeof window === "undefined") return makeServerStubStore();

  const store = configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      ui: uiReducer,
    },
  });

  // Hand the axios client our logout action (used when a 401 arrives),
  // done once here to avoid a circular import between the two files.
  setupInterceptors(() => store.dispatch(logout()));

  return store;
}

// Types of the store, used by the typed hooks below.
export interface RootState {
  auth: {
    user: import("@/lib/api/types").AuthUser | null;
    bakery: import("@/lib/api/types").Bakery | null;
    status: "loading" | "loggedIn" | "loggedOut";
  };
  cart: {
    bakeryId: number | null;
    bakeryName: string | null;
    items: import("./slices/cartSlice").CartItem[];
    isHydrated: boolean;
  };
  ui: {
    isMobileMenuOpen: boolean;
    isCartDrawerOpen: boolean;
  };
}

// The stub satisfies the same shape, so Provider accepts either.
export type AppStore = Store<RootState>;
export type AppDispatch = AppStore["dispatch"];

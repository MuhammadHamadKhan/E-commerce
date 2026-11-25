"use client";
// Creates the Redux store once per browser session and loads the cart
// after mount. The server checks the HttpOnly auth cookie through /me.
import { useEffect, useMemo, type ReactNode } from "react";
import { Provider } from "react-redux";
import { hydrateCart } from "@/store/slices/cartSlice";
import { makeStore, type AppStore } from "@/store/store";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  // One store for the lifetime of the browser session.
  const store = useMemo<AppStore>(() => makeStore(), []);

  // The cart stays in localStorage; auth is checked through the cookie.
  useEffect(() => {
    store.dispatch(hydrateCart());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}

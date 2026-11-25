"use client";
// TEMPORARY test page for the data layer (data layer task).
// Shows: raw JSON from useListings, an "add to cart" button per listing,
// the current Redux cart, and the login state.
// REMOVE LATER: just delete this file - src/app/dev-test/page.tsx.
import { useState } from "react";
import { useListings } from "@/hooks/queries/useListings";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/utils/formatPrice";

export default function DevTestPage() {
  const [page, setPage] = useState(1);
  const listingsQuery = useListings({ page, limit: 5, sort: "ending_soon" });
  const cart = useCart();
  const auth = useAuth();

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h1>Dev test page (temporary)</h1>

      <section>
        <h2>1. useListings raw JSON</h2>
        {listingsQuery.isPending && <p>Loading listings...</p>}
        {listingsQuery.isError && <p>Error: {String(listingsQuery.error)}</p>}
        {listingsQuery.data && (
          <pre style={{ background: "#f4f4f4", overflow: "auto", fontSize: 12 }}>
            {JSON.stringify(listingsQuery.data, null, 2)}
          </pre>
        )}
        <button onClick={() => setPage((p) => p + 1)}>Next page ({page})</button>
      </section>

      <section>
        <h2>2. Add first listing to cart</h2>
        {listingsQuery.data?.listings[0] && (
          <button
            onClick={() => {
              const listing = listingsQuery.data!.listings[0];
              const ok = cart.add(listing, listing.bakery_id, listing.bakery_name);
              if (!ok) {
                // Cart holds another bakery: replace it (simple version)
                cart.replaceWith(listing, listing.bakery_id, listing.bakery_name);
              }
            }}
          >
            Add &quot;{listingsQuery.data.listings[0].product_name}&quot; to cart
          </button>
        )}
      </section>

      <section>
        <h2>3. Redux cart</h2>
        <p>
          Bakery: {cart.bakeryName ?? "none"} | Items: {cart.itemCount} | Total:{" "}
          {formatPrice(cart.total)} | Savings: {formatPrice(cart.savings)}
        </p>
        <pre style={{ background: "#f4f4f4", overflow: "auto", fontSize: 12 }}>
          {JSON.stringify(cart.items, null, 2)}
        </pre>
        <button onClick={cart.clear}>Clear cart</button>
      </section>

      <section>
        <h2>4. Redux auth state</h2>
        <p>Login status: {auth.status}</p>
        <pre style={{ background: "#f4f4f4", overflow: "auto", fontSize: 12 }}>
          {JSON.stringify({ user: auth.user, bakery: auth.bakery }, null, 2)}
        </pre>
        {auth.isLoggedIn && <button onClick={auth.logout}>Logout</button>}
      </section>
    </div>
  );
}

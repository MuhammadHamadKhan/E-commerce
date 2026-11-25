"use client";
// CartContent: the interactive cart page (client component).
// See page.jsx for the server shell that exports SEO metadata.
// Re-checks every cart item against the backend on load so prices and
// stock are fresh; blocks checkout if any item is expired / sold out /
// low stock.
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { useCart } from "@/hooks/useCart";
import { getListing } from "@/lib/api/listings";
import { useBakery } from "@/hooks/queries/useBakery";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

export default function CartContent() {
  const router = useRouter();
  const cart = useCart();
  const dispatch = useAppDispatch();
  const items = cart.items;
  const itemCount = cart.itemCount;
  const total = cart.total;
  const savings = cart.savings;
  const bakeryId = cart.bakeryId;
  const bakeryName = cart.bakeryName;

  // Bakery details (name + address) for the cart note.
  const bakeryQuery = useBakery(bakeryId ?? 0);
  const bakery = bakeryId && bakeryQuery.data ? bakeryQuery.data.bakery : null;

  const ids = items.map((item) => item.listing_id);

  // One query that refreshes all cart listings at once. queryFn is a plain
  // function (not a hook), so calling getListing per id inside it is fine.
  const listingsQuery = useQuery({
    queryKey: ["cart-listings", ...ids],
    queryFn: () =>
      Promise.all(
        ids.map(async (id) => {
          try {
            const res = await getListing(id); // { success, listing }
            return { id, listing: res.listing, error: null };
          } catch (e) {
            return { id, listing: null, error: e };
          }
        })
      ),
    enabled: ids.length > 0,
  });

  // Map listing id -> { listing, error } for each cart item.
  const freshById = useMemo(() => {
    const map = {};
    (listingsQuery.data || []).forEach((r) => {
      map[r.id] = { listing: r.listing, error: r.error };
    });
    return map;
  }, [listingsQuery.data]);

  // Auto-lower any cart quantity that now exceeds stock (Redux dispatch,
  // not React setState, so it is safe inside an effect).
  useEffect(() => {
    items.forEach((item) => {
      const fresh = freshById[item.listing_id];
      if (fresh && item.quantity > fresh.quantity_left) {
        cart.setQty(item.listing_id, fresh.quantity_left);
      }
    });
  }, [items, freshById, cart]);

  // Problem items: expired / sold out / less stock than cart qty / unavailable.
  const problemItems = useMemo(() => {
    const out = [];
    items.forEach((item) => {
      const fresh = freshById[item.listing_id];
      if (!fresh) {
        out.push({ listing_id: item.listing_id, reason: "unavailable" });
        return;
      }
      if (fresh.quantity_left === 0) {
        out.push({ listing_id: item.listing_id, reason: "sold_out", fresh });
      } else if (item.quantity > fresh.quantity_left) {
        out.push({
          listing_id: item.listing_id,
          reason: "low_stock",
          fresh,
          newQty: fresh.quantity_left,
        });
      }
    });
    return out;
  }, [items, freshById]);

  const allLoaded = !listingsQuery.isPending;
  const anyError = listingsQuery.isError;
  const canCheckout =
    allLoaded && items.length > 0 && problemItems.length === 0 && !anyError;

  // EMPTY CART
  if (items.length === 0) {
    return (
      <div className="space-y-xl py-xl">
        <EmptyState
          title="Your cart is empty"
          description="There's nothing in your cart yet. Browse tonight's bakes and reserve what you like."
        />
        <div className="flex justify-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push("/")}
          >
            Go to home page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-xl py-xl">
      {/* Bakery note: all items collected from one bakery */}
      {bakery && (
        <section className="rounded-lg border border-outline-variant bg-surface-container-low p-lg">
          <p className="text-label uppercase tracking-wider text-on-surface-variant mb-sm">
            Collected from one bakery
          </p>
          <p className="font-semibold text-on-surface">{bakery.name}</p>
          {bakery.address && (
            <p className="text-body-sm text-on-surface-variant">
              {bakery.address}
            </p>
          )}
          <p className="mt-1 text-body-sm text-on-surface-variant">
            All items in your cart are collected from this one bakery at pickup time.
          </p>
        </section>
      )}

      <div className="grid gap-lg lg:grid-cols-12">
        {/* Item list: 8 columns */}
        <div className="lg:col-span-8 space-y-md">
          {items.map((item) => {
            const entry = freshById[item.listing_id] || {};
            const fresh = entry.listing;
            const listing = {
              data: fresh ? { listing: fresh } : null,
              isPending: listingsQuery.isPending,
              isError: !!entry.error,
              refetch: listingsQuery.refetch,
            };
            return (
              <CartItem
                key={item.listing_id}
                item={item}
                bakeryName={bakeryName}
                listing={listing}
                onSetQty={cart.setQty}
                onRemove={cart.remove}
              />
            );
          })}
        </div>

        {/* Summary: 4 columns */}
        <div className="lg:col-span-4">
          <CartSummary
            itemCount={itemCount}
            total={total}
            savings={savings}
            checkoutDisabled={!canCheckout}
            checkoutMessage={
              !canCheckout && items.length > 0
                ? "Please fix the cart items marked above before checking out."
                : null
            }
            onCheckout={() => router.push("/checkout")}
            onClearCart={() => {
              dispatch(clearCart());
              router.refresh();
            }}
          />
        </div>
      </div>

      {/* Checkout-blocking problem message */}
      {!canCheckout && items.length > 0 && (
        <section className="rounded-lg border border-error/30 bg-error-container/40 p-lg">
          <p className="font-semibold text-error mb-sm">
            Please fix your cart before checking out
          </p>
          <ul className="mb-lg space-y-xs text-body-sm text-on-surface-variant list-disc list-inside">
            {problemItems.map((p) => (
              <li key={p.listing_id}>
                {p.reason === "sold_out"
                  ? "Sold out – remove this item."
                  : p.reason === "low_stock"
                  ? `Quantity lowered to ${p.newQty} (only that many left).`
                  : "No longer available – remove this item."}
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" onClick={cart.clear}>
            Clear cart
          </Button>
        </section>
      )}
    </div>
  );
}

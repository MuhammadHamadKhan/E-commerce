"use client";
// CheckoutContent: the interactive checkout page (client component).
// See page.jsx for the server shell that exports SEO metadata.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  selectCartItems,
  selectCartTotal,
  selectCartSavings,
  selectCartBakery,
} from "@/store/slices/cartSlice";
import { usePlaceOrder } from "@/hooks/mutations/usePlaceOrder";
import { useBakery } from "@/hooks/queries/useBakery";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/formatDate";

export default function CheckoutContent() {
  const router = useRouter();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const savings = useAppSelector(selectCartSavings);
  const { bakeryId, bakeryName } = useAppSelector(selectCartBakery);

  const placeOrder = usePlaceOrder();
  const [submitError, setSubmitError] = useState(null);

  // Bakery details (address, phone) for the pickup note.
  // Always call the hook (hooks cannot be conditional); when there is no
  // bakery id we pass a fallback and simply render nothing for it.
  const bakeryQuery = useBakery(bakeryId ?? 0);
  const bakery = bakeryId && bakeryQuery.data ? bakeryQuery.data.bakery : null;

  // Pickup deadline = earliest expiry among the cart items.
  let earliestExpiry = null;
  if (items.length > 0) {
    earliestExpiry = items.reduce((earliest, it) => {
      const d = new Date(it.expires_at);
      return d < earliest ? d : earliest;
    }, new Date(items[0].expires_at));
  }

  // EMPTY CART -> redirect to cart (done in an effect, not during render).
  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  if (items.length === 0) return null;

  // Save a placed order to the guest "recent orders" list in localStorage.
  function saveRecentOrder(order) {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("lastbite_recent_orders");
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({
        code: order.pickup_code,
        bakery: bakeryName || "Bakery",
        date: order.created_at || new Date().toISOString(),
        total: total,
      });
      if (list.length > 10) list.length = 10;
      window.localStorage.setItem("lastbite_recent_orders", JSON.stringify(list));
    } catch {
      // ignore (private mode, quota, ...)
    }
  }

  const handleSubmit = async (orderData) => {
    setSubmitError(null);
    try {
      const res = await placeOrder.mutateAsync(orderData);
      const order = res && res.order;
      if (order && order.pickup_code) {
        saveRecentOrder(order);
        router.push(`/order/${order.pickup_code}`);
      } else {
        setSubmitError(
          "Order placed, but we did not get a pickup code. Try again."
        );
      }
    } catch (err) {
      const status = err && err.status;
      if (status === 409) {
        // Not enough stock or deal expired: back to cart with refreshed cart.
        setSubmitError(
          err && err.message
            ? String(err.message)
            : "One of your items is no longer available. We’ll refresh your cart."
        );
        router.push("/cart");
      } else {
        setSubmitError(
          err && err.message
            ? String(err.message)
            : "Network error. Please try again."
        );
      }
    }
  };

  return (
    <div className="space-y-xl py-xl">
      <div className="grid gap-lg lg:grid-cols-12">
        {/* Form: 8 columns */}
        <div className="lg:col-span-8 space-y-lg">
          <CheckoutForm
            items={items}
            loading={placeOrder.isPending}
            onSubmit={handleSubmit}
          />
          {submitError && (
            <div className="rounded-lg border border-error/30 bg-error-container/40 p-md">
              <p className="text-body-sm text-error">{submitError}</p>
              {!placeOrder.isPending && (
                <Button variant="outline" size="sm" onClick={() => setSubmitError(null)}>
                  Try again
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Order summary: 4 columns */}
        <div className="lg:col-span-4">
          <OrderSummary items={items} total={total} savings={savings} />

          {/* Bakery + pickup note */}
          {bakeryName && (
            <section className="mt-lg rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
              <p className="text-label uppercase tracking-wider text-on-surface-variant mb-sm">
                Pickup at
              </p>
              <p className="font-semibold text-on-surface mb-xs">
                {bakery.name || bakeryName}
              </p>
              {bakery.address && (
                <p className="text-body-sm text-on-surface-variant mb-xs">
                  {bakery.address}
                </p>
              )}
              {bakery.phone && (
                <p className="text-body-sm text-on-surface-variant mb-lg">
                  <a href={`tel:${bakery.phone}`} className="text-secondary hover:underline">
                    Call {bakery.name || "the bakery"}
                  </a>
                </p>
              )}
              <div className="rounded-md border border-outline-variant/50 bg-surface-container-low p-md">
                <p className="text-label uppercase tracking-wider text-on-surface-variant mb-xs">
                  Pay at the bakery
                </p>
                <p className="text-body-sm text-on-surface mb-xs">
                  Pay when you collect. No online payment.
                </p>
                {earliestExpiry && (
                  <p className="text-body-sm text-on-surface-variant">
                    Reserved until{" "}
                    <span className="font-semibold text-on-surface">
                      {formatDate(earliestExpiry)}
                    </span>
                  </p>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

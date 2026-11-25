"use client";
// OrderSummary: review of the order before placing it.
// Shows items, quantities, total, and total savings.
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";

export default function OrderSummary({ items, total, savings }) {
  return (
    <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
      <div className="mb-lg">
        <h2 className="font-display text-headline text-on-surface mb-md">
          Order summary
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          You will collect and pay at the bakery.
        </p>
      </div>

      <div className="space-y-md mb-lg">
        {items.map((item) => (
          <div
            key={item.listing_id}
            className="flex items-center justify-between gap-xs border-b border-outline-variant/50 pb-sm last:border-0"
          >
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-semibold text-on-surface line-clamp-1">
                {item.name}
              </p>
              <p className="text-label-sm text-on-surface-variant">
                {item.quantity} &times; {formatPrice(item.price)}
              </p>
            </div>
            <p className="shrink-0 text-body-sm font-semibold text-on-surface tabular-nums">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-xs mb-lg border-t border-outline-variant pt-md">
        <div className="flex items-baseline justify-between gap-xs">
          <p className="text-label uppercase tracking-wider text-on-surface-variant">
            Items total
          </p>
          <p className="text-lg font-bold text-on-surface tabular-nums">
            {formatPrice(total)}
          </p>
        </div>
        {savings > 0 && (
          <div className="flex items-baseline justify-between gap-xs">
            <p className="text-label uppercase tracking-wider text-success">
              You saved
            </p>
            <p className="text-lg font-bold text-success tabular-nums">
              Rs. {savings.toFixed(2)}
            </p>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-xs pt-md">
          <p className="text-label uppercase tracking-wider text-on-surface-variant">
            To pay at pickup
          </p>
          <p className="text-xl font-bold text-on-secondary tabular-nums">
            {formatPrice(total)}
          </p>
        </div>
      </div>

      <p className="text-body-sm text-on-surface-variant leading-relaxed">
        Pay cash or card at the counter when you collect. Your items are
        reserved until the deal ends.
      </p>
      <p className="mt-xs text-body-sm text-on-surface-variant">
        <Link
          href="/cart"
          className="text-secondary font-semibold hover:underline"
        >
          &larr; Change your cart
        </Link>
      </p>
    </section>
  );
}

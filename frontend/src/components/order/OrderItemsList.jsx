"use client";
// OrderItemsList: the items inside an order, with quantities and line totals.
import { formatPrice } from "@/utils/formatPrice";

export default function OrderItemsList({ items }) {
  if (!items || items.length === 0) {
    return (
      <p className="text-body-sm text-on-surface-variant">No items in this order.</p>
    );
  }

  return (
    <div className="space-y-xs">
      {items.map((item) => (
        <div
          key={item.order_item_id ?? item.product_name}
          className="flex items-center justify-between gap-xs border-b border-outline-variant/50 pb-sm last:border-0"
        >
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-semibold text-on-surface line-clamp-1">
              {item.product_name}
            </p>
            <p className="text-label-sm text-on-surface-variant">
              {item.quantity} &times; {formatPrice(item.price_at_purchase)}
            </p>
            {item.bakery_name && (
              <p className="text-body-sm text-on-surface-variant">
                {item.bakery_name}
              </p>
            )}
          </div>
          <p className="shrink-0 text-body-sm font-semibold text-on-surface tabular-nums">
            {formatPrice(item.line_total ?? item.price_at_purchase * item.quantity)}
          </p>
        </div>
      ))}
    </div>
  );
}

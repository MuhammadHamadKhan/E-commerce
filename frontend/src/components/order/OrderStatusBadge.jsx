"use client";
// OrderStatusBadge: colored badge for order status, plus a short
// plain-language explanation of what the status means.
// Colors match the design: accent (urgency), secondary (crust), success
// (sage), error (red), outline (muted).
export const ORDER_STATUS_INFO = {
  pending: {
    label: "Pending",
    variant: "accent",
    explanation:
      "Your order has been received and is waiting for the bakery to confirm it.",
  },
  confirmed: {
    label: "Confirmed",
    variant: "secondary",
    explanation:
      "The bakery has confirmed your order. Your items are reserved for pickup.",
  },
  picked_up: {
    label: "Picked up",
    variant: "success",
    explanation: "Your order has been collected. Thanks for rescuing food!",
  },
  cancelled: {
    label: "Cancelled",
    variant: "error",
    explanation: "This order was cancelled and can no longer be collected.",
  },
  expired: {
    label: "Expired",
    variant: "outline",
    explanation:
      "The pickup window has ended. This order can no longer be collected.",
  },
};

// Tailwind variant classes for the badge (pill shaped).
const VARIANT_CLASSES = {
  accent: "bg-accent text-white uppercase",
  secondary: "bg-secondary text-on-secondary uppercase",
  success: "bg-success text-on-success uppercase",
  error: "bg-error text-on-error uppercase",
  outline:
    "bg-surface-container-low text-on-surface border border-outline-variant uppercase",
};

export default function OrderStatusBadge({ status, showExplanation = true }) {
  const info = ORDER_STATUS_INFO[status] || ORDER_STATUS_INFO.pending;

  return (
    <div className="flex flex-col gap-xs">
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-label-sm font-semibold ${
          VARIANT_CLASSES[info.variant]
        }`}
      >
        {info.label}
      </span>
      {showExplanation && (
        <p className="text-body-sm text-on-surface-variant">
          {info.explanation}
        </p>
      )}
    </div>
  );
}

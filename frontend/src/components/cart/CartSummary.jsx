"use client";
// CartSummary: the cart total, savings, and checkout button shown beside
// the item list. Stacked on mobile, side-by-side on desktop.
import Link from "next/link";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/utils/formatPrice";

export default function CartSummary({
  itemCount,
  total,
  savings,
  checkoutDisabled,
  checkoutMessage,
  onCheckout,
  onClearCart,
}) {
  return (
    <section className="mt-lg md:mt-0 rounded-card border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
      <h2 className="font-display font-semibold text-on-surface text-xl mb-md">
        Order summary
      </h2>
      <div className="space-y-sm">
        <div className="border-b border-outline-variant/60 pb-sm mb-sm flex items-baseline justify-between gap-xs">
          <p className="text-label uppercase tracking-wider text-on-surface-variant">
            Items total ({itemCount})
          </p>
          <p className="text-lg font-bold text-on-surface tabular-nums">
            {formatPrice(total)}
          </p>
        </div>
        {savings > 0 && (
          <div className="flex items-baseline justify-between gap-xs mb-lg">
            <p className="text-label uppercase tracking-wider text-success">
              You saved
            </p>
            <p className="text-lg font-bold text-success tabular-nums">
              Rs. {savings.toFixed(2)}
            </p>
          </div>
        )}
        {checkoutMessage && (
          <p className="text-body-sm text-error mb-sm">{checkoutMessage}</p>
        )}
        <Button
          variant="primary"
          disabled={checkoutDisabled}
          onClick={onCheckout}
          className="w-full min-h-[50px] text-lg"
        >
          Continue to checkout
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearCart}
          className="mt-sm w-full text-error border-error/30 hover:bg-error/10"
        >
          Clear cart
        </Button>
        <p className="mt-sm text-center">
          <Link
            href="/"
            className="text-body-sm text-secondary font-semibold hover:underline"
          >
            &larr; Continue browsing
          </Link>
        </p>
      </div>
    </section>
  );
}

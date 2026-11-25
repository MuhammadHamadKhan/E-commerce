"use client";
// CartDrawer: slide-over cart preview. Opens from the navbar cart icon.
// It is drawn with a "portal" so it always covers the whole screen,
// even when the navbar has blur or transform styles.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectCartItems,
  selectCartTotal,
  setQuantity,
  removeItem,
} from "@/store/slices/cartSlice";
import { formatPrice } from "@/utils/formatPrice";

export default function CartDrawer({ onClose }) {
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  const [mounted, setMounted] = useState(false); // portal needs the browser
  const [visible, setVisible] = useState(false); // controls the slide animation
  const closeBtnRef = useRef(null);
  const previousFocus = useRef(null);

  // Start the slide-in animation, lock page scroll, and remember focus.
  useEffect(() => {
    previousFocus.current = document.activeElement;
    const frame = requestAnimationFrame(() => {
      setMounted(true);
      setVisible(true);
    });
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = oldOverflow;
      previousFocus.current?.focus?.();
    };
  }, []);

  // Slide out first, then tell the parent to remove the drawer.
  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 200);
  }

  // Close with the Escape key.
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!mounted) return null;

  const itemCount = items.length;

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Your cart">
      {/* Dark background: click to close */}
      <div
        className={`absolute inset-0 bg-primary-container/40 backdrop-blur-[2px] transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* The drawer panel */}
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-surface-container-lowest shadow-overlay border-l border-outline-variant transition-transform duration-200 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 px-lg py-md">
          <div>
            <h2 className="font-display text-headline text-on-surface">Your cart</h2>
            {itemCount > 0 && (
              <p className="text-label-sm text-on-surface-variant">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            )}
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={handleClose}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none text-on-surface-variant hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-secondary"
          >
            &times;
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-lg py-md">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-sm text-center">
              <p className="font-display text-headline text-on-surface">Nothing here yet</p>
              <p className="max-w-[26ch] text-body-sm text-on-surface-variant">
                Fresh deals disappear fast. Have a look at what is left today.
              </p>
              <Link
                href="/"
                onClick={handleClose}
                className="mt-xs inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary-container px-6 text-label font-semibold text-on-primary hover:bg-[#3d2f2a]"
              >
                Browse today&apos;s deals
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-outline-variant/50">
              {items.map((item) => (
                <CartDrawerItem key={item.listing_id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer: only when there are items */}
        {items.length > 0 && (
          <div className="space-y-sm border-t border-outline-variant/60 bg-surface-container-lowest px-lg py-md">
            <div className="flex items-baseline justify-between">
              <p className="text-label uppercase tracking-wider text-on-surface-variant">Total</p>
              <p className="text-xl font-bold tabular-nums text-on-surface">{formatPrice(total)}</p>
            </div>
            <p className="text-label-sm text-on-surface-variant">
              Pay at the bakery when you collect. No online payment needed.
            </p>
            <Link
              href="/checkout"
              onClick={handleClose}
              className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-primary-container px-5 text-lg font-semibold text-on-primary hover:bg-[#3d2f2a]"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={handleClose}
              className="block text-center text-label font-semibold text-on-surface-variant underline-offset-2 hover:text-on-surface hover:underline"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </div>,
    document.body
  );
}

// One cart row inside the slide-over drawer. Redux is the source of truth
// so the quantity, totals, cart page, and checkout stay in sync.
function CartDrawerItem({ item }) {
  const dispatch = useAppDispatch();
  const qty = item.quantity;
  const maxQty = item.quantity_left ?? Infinity;

  const decrement = () => {
    const next = Math.max(1, qty - 1);
    dispatch(setQuantity({ listingId: item.listing_id, quantity: next }));
  };

  const increment = () => {
    const next = Math.min(qty + 1, maxQty);
    dispatch(setQuantity({ listingId: item.listing_id, quantity: next }));
  };

  const lineTotal = item.price * qty;

  return (
    <li key={item.listing_id} className="flex gap-sm py-md first:pt-0">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface-container-low">
        <Image
          src={item.image_url || "/images/placeholder-product.svg"}
          alt=""
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-xs">
          <p className="line-clamp-2 text-body-sm font-medium text-on-surface">
            {item.name}
          </p>
          <button
            type="button"
            onClick={() => dispatch(removeItem(item.listing_id))}
            aria-label={`Remove ${item.name}`}
            className="shrink-0 text-label-sm text-on-surface-variant underline-offset-2 hover:text-on-surface hover:underline"
          >
            Remove
          </button>
        </div>

        <div className="mt-xs flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border border-outline-variant">
            {qty === 1 ? (
              <button
                type="button"
                onClick={() => dispatch(removeItem(item.listing_id))}
                aria-label="Remove item"
                className="flex h-8 w-8 items-center justify-center rounded-full text-error hover:bg-error/10 border-error/30"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={decrement}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
                className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface hover:bg-surface-container disabled:opacity-40"
              >
                &minus;
              </button>
            )}
            <span className="w-6 text-center text-body-sm tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              onClick={increment}
              disabled={qty >= maxQty}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface hover:bg-surface-container disabled:opacity-40"
            >
              +
            </button>
          </div>

          <p className="text-body-sm font-semibold tabular-nums text-on-surface">
            {formatPrice(lineTotal)}
          </p>
        </div>

        {qty >= maxQty && Number.isFinite(maxQty) && (
          <p className="mt-1 text-label-sm text-secondary">Only {maxQty} left</p>
        )}
      </div>
    </li>
  );
}
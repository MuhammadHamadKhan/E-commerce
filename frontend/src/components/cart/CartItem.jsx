"use client";
// CartItem: one row in the cart. Shows the refreshed price/stock from the
// listing hook, quantity controls (min 1, max stock left), and a remove
// button. Big tap targets so it is easy to use on phones.
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatPrice } from "@/utils/formatPrice";

export default function CartItem({
  item, // from Redux cart: { listing_id, name, image_url, price, quantity, ... }
  bakeryName, // all items come from one bakery
  listing, // useListing result for this item: { data, isPending, isError, error, refetch }
  onSetQty, // (listingId, quantity) -> Redux
  onRemove, // (listingId) -> Redux
}) {
  const [qty, setQty] = useState(item.quantity);
  const [adjusting, setAdjusting] = useState(null); // listingId being saved

  const fresh = listing.data ? listing.data.listing : null;
  const stockLeft = fresh ? fresh.quantity_left : item.quantity_left;
  const freshPrice = fresh ? Number(fresh.discounted_price) : item.price;

  const isProblem =
    listing.isError || (fresh && fresh.quantity_left === 0);
  const priceChanged =
    fresh && Number.isFinite(freshPrice) && Number.isFinite(item.price) &&
    freshPrice.toFixed(2) !== item.price.toFixed(2);
  const qtyLowered = fresh && item.quantity > fresh.quantity_left;

  // Keep the local input in sync if Redux quantity was changed automatically.
  if (qty !== item.quantity) setQty(item.quantity);

  const saveQty = (next) => {
    const clamped = Math.min(Math.max(1, next), stockLeft);
    setAdjusting(item.listing_id);
    onSetQty(item.listing_id, clamped);
    setTimeout(() => setAdjusting(null), 600);
  };

  const increment = () => saveQty(qty + 1);
  const decrement = () => saveQty(qty - 1);

  const lineTotal = freshPrice * qty;

  if (listing.isPending) {
    return (
      <article className="flex items-center gap-md rounded-card border border-outline-variant/50 bg-surface-container-lowest p-md shadow-card animate-pulse">
        <div className="h-16 w-16 shrink-0 rounded-md bg-surface-container-high" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 w-1/2 bg-surface-container-high" />
          <div className="h-4 w-1/3 bg-surface-container-high" />
        </div>
        <div className="h-16 w-24 shrink-0 bg-surface-container-high" />
      </article>
    );
  }

  if (listing.isError) {
    return (
      <article className="flex flex-col gap-sm rounded-card border border-error/30 bg-error-container/40 p-md shadow-card">
        <div className="flex items-center gap-md">
          <div className="h-16 w-16 shrink-0 rounded-md bg-surface-container-high" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-on-surface">{item.name}</p>
            <p className="text-body-sm text-on-surface-variant">{bakeryName ?? ""}</p>
            <Badge variant="accent" className="mt-1">
              No longer available
            </Badge>
            <p className="mt-1 text-body-sm text-error">
              This bake has expired or was removed by the bakery. Remove it from your cart to continue.
            </p>
          </div>
        </div>
        <div className="mt-2 text-body font-semibold text-on-surface">
          {formatPrice(item.price * item.quantity)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(item.listing_id)}
          className="mt-2"
        >
          Remove
        </Button>
      </article>
    );
  }

  return (
    <article className="flex flex-col md:flex-row gap-md items-start md:items-center rounded-card border border-outline-variant/50 bg-surface-container-lowest p-md shadow-card">
      {/* Photo */}
      <div className="shrink-0 relative h-16 w-16 rounded-md overflow-hidden bg-surface-container-low">
        <Image
          src={item.image_url || "/images/placeholder-product.svg"}
          alt={item.name}
          width={64}
          height={64}
          className="object-cover"
          onError={(e) => {
            e.target.src = "/images/placeholder-product.svg";
          }}
        />
        {fresh && fresh.discount_percent && Number(fresh.discount_percent) > 0 && (
          <Badge variant="discount" className="absolute left-1 top-1 z-10">
            -{Math.round(Number(fresh.discount_percent))}%
          </Badge>
        )}
        {fresh && fresh.quantity_left !== null && fresh.quantity_left <= 2 && fresh.quantity_left > 0 && (
          <Badge variant="accent" className="absolute right-1 top-1 z-10">
            {fresh.quantity_left} left
          </Badge>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/listings/${item.listing_id}`}
          className="font-semibold text-on-surface hover:text-secondary transition-colors"
        >
          {item.name}
        </Link>
        <p className="text-body-sm text-on-surface-variant">
          {item.bakery_name ?? ""}
        </p>

        {listing.isError && (
          <p className="mt-1 text-body-sm text-error">
            Could not refresh this item. <span className="cursor-pointer hover:underline text-secondary" onClick={() => listing.refetch()}>Try again</span>
          </p>
        )}

        {/* Stock / price notes */}
        <div className="mt-2 flex flex-wrap gap-xs">
          {priceChanged && (
            <span className="text-body-sm text-on-surface-variant">
              Price updated: {formatPrice(item.price)} &rarr; {formatPrice(freshPrice)}
            </span>
          )}
          {qtyLowered && (
            <Badge variant="accent" className="text-xs">
              Only {stockLeft} left &mdash; quantity lowered
            </Badge>
          )}
          {fresh && fresh.quantity_left === 0 && (
            <Badge variant="accent" className="text-xs font-bold">
              Sold out
            </Badge>
          )}
        </div>
      </div>

      {/* Quantity controls */}
      <div className="mt-4 md:mt-0 md:flex md:items-center md:gap-xs">
        <label className="text-label-sm text-on-surface-variant">Qty</label>
        {qty > 1 ? (
          <Button
            variant="outline"
            size="sm"
            disabled={isProblem || adjusting === item.listing_id}
            onClick={decrement}
            aria-label="Decrease quantity"
            className="h-10 w-10"
          >
            -
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled={isProblem || adjusting === item.listing_id}
            onClick={() => onRemove(item.listing_id)}
            aria-label="Remove item"
            className="h-10 w-10"
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
          </Button>
        )}
        <input
          type="number"
          value={qty}
          min="1"
          max={stockLeft || 1}
          disabled={isProblem || adjusting === item.listing_id}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          onBlur={() => saveQty(qty)}
          className="w-16 h-10 rounded-md border border-outline-variant bg-surface-container-lowest text-center text-on-surface text-body-sm"
        />
        <Button
          variant="outline"
          size="sm"
          disabled={isProblem || adjusting === item.listing_id || qty >= (stockLeft || 1)}
          onClick={increment}
          aria-label="Increase quantity"
          className="h-10 w-10"
        >
          +
        </Button>
        {fresh && (
          <p className="text-body-sm text-on-surface-variant">
            {stockLeft === 0 ? "Sold out" : `Stock left: ${stockLeft}`}
          </p>
        )}
      </div>

      {/* Remove + line total */}
      <div className="mt-4 md:mt-0 md:flex md:items-center md:justify-between md:ml-4 gap-xs">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(item.listing_id)}
          className="text-error hover:bg-error/10 border-error/30"
        >
          Remove
        </Button>
        <div className="text-right md:text-left">
          <p className="text-body-sm text-on-surface-variant">Line total</p>
          <p className="font-semibold text-on-surface">{formatPrice(lineTotal)}</p>
        </div>
      </div>
    </article>
  );
}

"use client";
// Listing detail page: professional product page with image, price,
// stock, countdown, quantity selector, add to cart, and related items.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useListing } from "@/hooks/queries/useListing";
import { useBakery } from "@/hooks/queries/useBakery";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Spinner from "@/components/ui/Spinner";
import CountdownTimer from "@/components/listing/CountdownTimer";
import StockBadge from "@/components/listing/StockBadge";
import DiscountBadge from "@/components/listing/DiscountBadge";
import Modal from "@/components/ui/Modal";
import ListingCard from "@/components/listing/ListingCard";
import { formatPrice } from "@/utils/formatPrice";
import { formatDate } from "@/utils/formatDate";

export default function ListingContent({ id }) {
  const router = useRouter();
  const cart = useCart();
  const listingId = Number(id);

  // All hooks called unconditionally (before any early return).
  const listingQuery = useListing(listingId);
  const listing = listingQuery.data ? listingQuery.data.listing : null;
  const cartItem = listing
    ? cart.items.find((item) => item.listing_id === listing.id)
    : null;

  // Always called (hooks must be unconditional). Passes listing.bakery_id when
  // available, otherwise 0 (harmless dummy fetch while listing loads).
  const bakeryQuery = useBakery(listing ? listing.bakery_id : 0);
  const [quantity, setQuantity] = useState(1);
  const [showReplace, setShowReplace] = useState(false);

  // Keep the local quantity in sync when the item is removed from the cart
  // (e.g. via the delete icon), so the UI reflects the empty state right away
  // instead of falling back to a stale local value of 1.
  useEffect(() => {
    if (!cartItem) setQuantity(1);
  }, [cartItem]);

  const bakery = bakeryQuery.data ? bakeryQuery.data.bakery : null;
  const relatedListings = (bakeryQuery.data?.active_listings ?? []).filter(
    (item) => listing && item.id !== listing.id
  );

  const maxQty = listing ? listing.quantity_left : 0;
  const selectedQuantity = cartItem?.quantity ?? quantity;
  const isSoldOut = maxQty === 0;
  const unitPrice = listing ? Number(listing.discounted_price) : 0;
  const originalPrice = listing ? Number(listing.original_price) : 0;
  const lineTotal = unitPrice * selectedQuantity;
  const savings = (originalPrice - unitPrice) * selectedQuantity;

  // API error: bake not found or backend down.
  if (listingQuery.isError) {
    return (
      <div className="py-xl">
        <ErrorMessage
          message="We couldn't find this bake. It may have expired or been removed."
        />
        <Link
          href="/listings"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-outline-variant px-6 text-label font-semibold text-on-surface hover:bg-surface-container"
        >
          Back to all deals
        </Link>
      </div>
    );
  }

  // Loading state.
  if (listingQuery.isPending || !listing) {
    return (
      <div className="py-xl flex flex-col items-center gap-sm">
        <Spinner size="lg" />
        <p className="text-body text-on-surface-variant">Loading bake details…</p>
      </div>
    );
  }


  const handleAddToCart = (e) => {
    e.preventDefault();
    const ok = cart.addAtQuantity(
      listing,
      listing.bakery_id,
      listing.bakery_name,
      selectedQuantity
    );
    if (!ok) setShowReplace(true);
  };

  // "Buy now": add this bake to the cart and jump straight to checkout.
  const handleCheckout = () => {
    const ok = cart.addAtQuantity(
      listing,
      listing.bakery_id,
      listing.bakery_name,
      selectedQuantity
    );
    if (ok) router.push("/checkout");
  };

  const handleSetQty = (next) => {
    const clamped = Math.min(Math.max(1, next), maxQty || 1);
    if (cartItem) {
      cart.setListingQty(
        listing,
        listing.bakery_id,
        listing.bakery_name,
        clamped
      );
    } else {
      setQuantity(clamped);
    }
  };

  return (
    <div className="space-y-xl py-xl">
      {/* Breadcrumbs */}
      <nav className="flex gap-1 text-label-sm text-on-surface-variant">
        <Link
          href="/"
          className="hover:text-secondary transition-colors"
        >
          Home
        </Link>
        <span className="mx-0.5">/</span>
        <span className="text-on-surface">{listing.product_name}</span>
      </nav>

      <div className="grid gap-lg lg:grid-cols-12">
        {/* ===== LEFT: Image gallery (8 cols desktop) ===== */}
        <div className="lg:col-span-8 space-y-md">
          <div
            className={`relative aspect-[4/3] w-full rounded-card overflow-hidden bg-surface-container-low border border-outline-variant/60 shadow-card ${
              isSoldOut ? "opacity-60" : ""
            }`}
          >
            <Image
              src={listing.image_url || "/images/placeholder-product.svg"}
              alt={listing.product_name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              className="object-cover"
              priority
              onError={(e) => {
                e.target.src = "/images/placeholder-product.svg";
              }}
            />
            <div className="absolute left-3 top-3 z-10">
              {Number(listing.discount_percent) > 0 && (
                <DiscountBadge percent={listing.discount_percent} />
              )}
            </div>
            <div className="absolute right-3 top-3 z-10">
              <StockBadge quantityLeft={listing.quantity_left} />
            </div>
            {isSoldOut && (
              <div className="absolute inset-0 bg-primary-container/85 flex items-center justify-center z-20">
                <span className="text-lg font-bold text-on-primary">Sold out</span>
              </div>
            )}
          </div>

          {listing.description && (
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
              <p
                className="text-label uppercase tracking-wider text-on-surface-variant mb-xs"
              >
                About this bake
              </p>
              <p className="text-body text-on-surface-variant leading-relaxed">
                {listing.description}
              </p>
            </div>
          )}
        </div>

        {/* ===== RIGHT: Details card (4 cols desktop) ===== */}
        <div className="lg:col-span-4 space-y-lg">
          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card sticky top-24">
            {/* Bakery name link */}
            {bakery && (
              <Link
                href={`/bakeries/${bakery.id}`}
                className="flex items-center gap-xs mb-md"
              >
                <span
                  className="text-label uppercase tracking-wider text-secondary font-bold"
                >
                  {bakery.name}
                </span>
              </Link>
            )}

            <h1
              className="font-display text-2xl font-semibold text-on-surface mb-sm leading-snug"
            >
              {listing.product_name}
            </h1>

            <div className="flex items-center gap-xs mb-md">
              <StockBadge quantityLeft={listing.quantity_left} />
              <span className="text-label-sm text-on-surface-variant">
                {listing.city} &middot; {formatDate(listing.expires_at)}
              </span>
            </div>

            {/* Price block */}
            <div className="mb-lg">
              <span
                className="text-label uppercase tracking-wider text-on-surface-variant block"
              >
                Today&rsquo;s price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-on-surface tabular-nums">
                  {formatPrice(listing.discounted_price)}
                </span>
                <span className="text-lg text-on-surface-variant line-through">
                  {formatPrice(listing.original_price)}
                </span>
                {Number(listing.discount_percent) > 0 && (
                  <Badge variant="discount" className="text-xs ml-2">
                    -{Math.round(Number(listing.discount_percent))}%
                  </Badge>
                )}
              </div>
              <p className="text-body-sm text-on-surface-variant mt-xs">
                Pay when you collect at the bakery.
              </p>
              {savings > 0 && (
                <p className="text-body-sm text-success font-semibold mt-xs">
                  You save {formatPrice(savings)} today
                </p>
              )}
            </div>

            {/* Countdown */}
            <div className="mb-lg rounded-lg border border-outline-variant/50 bg-surface-container-low p-sm">
              <CountdownTimer expiresAt={listing.expires_at} />
            </div>

            {/* Quantity selector */}
            <div className="space-y-sm">
              <label
                className="text-label uppercase tracking-wider text-on-surface-variant block"
              >
                Quantity
              </label>
              <div className="flex py-2 items-center gap-xs">
                {cartItem && selectedQuantity === 1 ? (
                  <button
                    type="button"
                    onClick={() => cart.remove(listingId)}
                    aria-label="Remove from cart"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-error/10 border border-error/30 text-error hover:bg-error/20 disabled:opacity-40"
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
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isSoldOut || selectedQuantity <= 1}
                    onClick={() => handleSetQty(selectedQuantity - 1)}
                    className="h-10 w-10"
                    aria-label="Decrease quantity"
                  >
                    −
                  </Button>
                )}
                <input
                  type="number"
                  value={selectedQuantity}
                  min="1"
                  max={maxQty || 1}
                  disabled={isSoldOut}
                  onChange={(e) =>
                    handleSetQty(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-16 h-10 rounded-md border border-outline-variant bg-surface-container-lowest text-center text-on-surface text-body-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isSoldOut || selectedQuantity >= maxQty}
                  onClick={() => handleSetQty(selectedQuantity + 1)}
                  className="h-10 w-10"
                  aria-label="Increase quantity"
                >
                  +
                </Button>
                <span className="text-label-sm text-on-surface-variant ml-2">
                  Max {maxQty} available
                </span>
              </div>
             
            </div>

            {/* Add to cart */}
            <Button
              variant="primary"
              size="lg"
              disabled={isSoldOut}
              onClick={handleAddToCart}
              className="w-full min-h-[50px] text-lg"
            >
              {isSoldOut
                ? "Sold out"
                : cartItem
                  ? "Update cart"
                  : "Add to cart"}
            </Button>

            {/* Direct checkout: add this bake and go straight to checkout */}
            <Button
              variant="outline"
              size="lg"
              disabled={isSoldOut}
              onClick={handleCheckout}
              className="mt-sm w-full min-h-[50px] text-lg"
            >
              {isSoldOut ? "Sold out" : "Checkout"}
            </Button>

            {/* Bakery info card */}
            {bakery && (
              <div
                className="mt-lg rounded-lg border border-outline-variant/50 bg-surface-container-low p-sm"
              >
                <p
                  className="text-label uppercase tracking-wider text-on-surface-variant mb-xs"
                >
                  Pickup at
                </p>
                <p className="font-semibold text-on-surface mb-xs">
                  {bakery.name}
                </p>
                <p className="text-body-sm text-on-surface-variant mb-xs">
                  {bakery.address}
                </p>
                <a
                  href={`tel:${bakery.phone}`}
                  className="text-body-sm text-secondary hover:underline inline-block"
                >
                  Call {bakery.name} &middot; {bakery.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Related items from same bakery ===== */}
      {relatedListings.length > 0 && (
        <section className="space-y-md">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-on-surface">
              More from {bakery?.name}
            </h2>
            {bakery && (
              <Link
                href={`/bakeries/${bakery.id}`}
                className="text-label-sm font-semibold text-secondary hover:underline"
              >
                View all &rarr;
              </Link>
            )}
          </div>
          <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-4">
            {relatedListings.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                action="cart"
              />
            ))}
          </div>
        </section>
      )}

      {/* Replace cart modal */}
      <Modal
        open={showReplace}
        onClose={() => setShowReplace(false)}
        title="Replace your cart?"
      >
        <p className="text-body-sm text-on-surface-variant mb-lg">
          Your cart currently has items from another bakery. To keep pickup
          simple, you can only collect from one bakery per order. Replace your
          cart with this bake?
        </p>
        <div className="flex justify-end gap-xs">
          <button
            type="button"
            onClick={() => setShowReplace(false)}
            className="rounded-full border border-outline-variant px-4 py-2 text-label font-medium text-on-surface hover:bg-surface-container"
          >
            Keep current cart
          </button>
          <button
            type="button"
            onClick={() => {
              cart.clear();
              cart.addAtQuantity(
                listing,
                listing.bakery_id,
                listing.bakery_name,
                selectedQuantity
              );
              setShowReplace(false);
              router.push("/cart");
            }}
            className="rounded-full bg-secondary px-4 py-2 text-label font-bold text-on-secondary hover:bg-secondary/90 shadow-sm"
          >
            Replace cart
          </button>
        </div>
      </Modal>
    </div>
  );
}

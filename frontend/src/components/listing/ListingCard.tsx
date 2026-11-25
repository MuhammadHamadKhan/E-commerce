"use client";
// ListingCard: an artisanal food product card with real photography,
// paper sticker discount badge, stock countdown, dashed ticket divider,
// and smooth responsive hover/press states.
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DiscountBadge from "./DiscountBadge";
import StockBadge from "./StockBadge";
import CountdownTimer from "./CountdownTimer";
import Modal from "@/components/ui/Modal";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import type { Listing } from "@/lib/api/types";

type ListingCardProps = {
  listing: Listing;
  action?: "cart" | "reserve" | "none";
  featured?: boolean;
};

export default function ListingCard({
  listing,
  action = "none",
  featured = false,
}: ListingCardProps) {
  const cart = useCart();
  const [imageSrc, setImageSrc] = useState(listing.image_url || "/images/placeholder-product.svg");
  const [showReplace, setShowReplace] = useState(false);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = cart.add(listing, listing.bakery_id, listing.bakery_name);
    if (!ok) setShowReplace(true);
  };

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-card border border-outline-variant/60 bg-surface-container-lowest shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift active:scale-[0.99] ${
        featured ? "sm:col-span-2 sm:flex-row" : ""
      }`}
    >
      {/* Product photo area */}
      <div
        className={`relative overflow-hidden bg-surface-container-low ${
          featured ? "h-64 sm:h-auto sm:w-1/2" : "aspect-[4/3] w-full"
        }`}
      >
        <Image
          src={imageSrc}
          alt={listing.product_name}
          fill
          sizes={
            featured
              ? "(max-width: 640px) 100vw, 50vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          }
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => setImageSrc("/images/placeholder-product.svg")}
        />

        {/* Sticker discount badge (top left) */}
        <div className="absolute left-3 top-3 z-10">
          <DiscountBadge percent={listing.discount_percent} />
        </div>

        {/* Stock tag (top right) */}
        <div className="absolute right-3 top-3 z-10">
          <StockBadge quantityLeft={listing.quantity_left} />
        </div>
      </div>

      {/* Card body & details */}
      <div className={`flex flex-1 flex-col justify-between p-4 ${featured ? "sm:p-6" : ""}`}>
        <div>
          {/* Bakery info & neighborhood */}
          <div className="flex items-center justify-between text-label text-secondary">
            <span className="font-semibold tracking-wide uppercase">
              {listing.bakery_name}
            </span>
            <span className="text-body-sm text-on-surface-variant font-normal">
              {listing.city}
            </span>
          </div>

          {/* Product name */}
          <h3
            className={`mt-1 font-display font-semibold text-on-surface transition-colors group-hover:text-secondary ${
              featured ? "text-xl sm:text-2xl" : "text-base line-clamp-1"
            }`}
          >
            {listing.product_name}
          </h3>

          {/* Description */}
          {listing.description && (
            <p className="mt-1 line-clamp-2 text-body-sm text-on-surface-variant">
              {listing.description}
            </p>
          )}

          {/* Live countdown */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <CountdownTimer expiresAt={listing.expires_at} />
          </div>
        </div>

        {/* Ticket-style price and action area */}
        <div className="mt-4 border-t border-dashed border-outline-variant/70 pt-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                Tonight&apos;s Price
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-on-surface sm:text-xl">
                  {formatPrice(listing.discounted_price)}
                </span>
                <span className="text-xs text-on-surface-variant line-through">
                  {formatPrice(listing.original_price)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="relative z-10">
              {action === "cart" && (
                <button
                  type="button"
                  onClick={addToCart}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-primary-container px-4 py-2 text-label font-semibold text-on-primary shadow-sm transition-all hover:bg-secondary active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  aria-label={`Add ${listing.product_name} to cart`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span>Add</span>
                </button>
              )}
              {action === "reserve" && (
                <Link
                  href={`/listings/${listing.id}`}
                  className="inline-flex min-h-[44px] items-center rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 text-label font-semibold text-on-surface transition-colors hover:bg-secondary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  Reserve →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Whole card link */}
      <Link
        href={`/listings/${listing.id}`}
        aria-label={`View deal for ${listing.product_name}`}
        className="absolute inset-0 rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      />

      {/* Modal if cart contains another bakery */}
      <Modal
        open={showReplace}
        onClose={() => setShowReplace(false)}
        title="Replace your cart?"
      >
        <p className="text-body-sm text-on-surface-variant">
          Your cart currently has items from another bakery. To keep pickup simple,
          you can only collect from one bakery per order. Would you like to clear your
          cart and add this deal?
        </p>
        <div className="relative z-20 mt-md flex justify-end gap-sm">
          <button
            type="button"
            onClick={() => setShowReplace(false)}
            className="rounded-full border border-outline-variant px-4 py-2 text-label font-medium text-on-surface hover:bg-surface-container"
          >
            Keep current cart
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              cart.replaceWith(listing, listing.bakery_id, listing.bakery_name);
              setShowReplace(false);
            }}
            className="rounded-full bg-secondary px-4 py-2 text-label font-bold text-on-secondary hover:bg-secondary/90 shadow-sm"
          >
            Replace cart
          </button>
        </div>
      </Modal>
    </article>
  );
}

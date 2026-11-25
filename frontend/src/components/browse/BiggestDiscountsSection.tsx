"use client";
// BiggestDiscountsSection: top active listings ranked by discount %.
// Receives filtered listings from the page (search applied at page level).
import ListingGrid from "@/components/listing/ListingGrid";
import type { Listing } from "@/lib/api/types";

type BiggestDiscountsSectionProps = {
  listings: Listing[];
};

export function BiggestDiscountsSection({ listings }: BiggestDiscountsSectionProps) {
  if (listings.length === 0) {
    return (
      <div className="rounded-card border border-outline-variant/50 bg-surface-container-low p-6 text-center">
        <p className="text-body-sm text-on-surface-variant">
          No discounted deals match your search.
        </p>
      </div>
    );
  }

  return (
    <ListingGrid listings={listings} action="cart" loading={false} skeletonCount={0} />
  );
}

"use client";
// EndingSoonSection: listings expiring within the next 6 hours.
// Receives filtered listings from the page (search applied at page level).
import ListingGrid from "@/components/listing/ListingGrid";
import type { Listing } from "@/lib/api/types";

type EndingSoonSectionProps = {
  listings: Listing[];
};

export function EndingSoonSection({ listings }: EndingSoonSectionProps) {
  if (listings.length === 0) {
    return (
      <div className="rounded-card border border-outline-variant/50 bg-surface-container-low p-6 text-center">
        <p className="text-body-sm text-on-surface-variant">
          Nothing expiring soon right now.
        </p>
      </div>
    );
  }

  return <ListingGrid listings={listings} action="cart" loading={false} skeletonCount={0} />;
}

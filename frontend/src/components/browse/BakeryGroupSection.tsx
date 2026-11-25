"use client";
// BakeryGroupSection: each bakery as a card with its active listings nested below.
// Receives filtered bakery groups from the page (search applied at page level).
import Link from "next/link";
import ListingGrid from "@/components/listing/ListingGrid";
import type { Listing } from "@/lib/api/types";

interface BakeryGroup {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  active_listing_count: number;
  listings: Listing[];
}

type BakeryGroupSectionProps = {
  bakeries: BakeryGroup[];
};

export function BakeryGroupSection({ bakeries }: BakeryGroupSectionProps) {
  if (bakeries.length === 0) {
    return (
      <div className="rounded-card border border-outline-variant/50 bg-surface-container-low p-6 text-center">
        <p className="text-body-sm text-on-surface-variant">
          No bakeries match your search.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-lg">
      {bakeries.map((bakery) => (
        <section
          key={bakery.id}
          className="rounded-card border border-outline-variant/60 bg-surface-container-lowest shadow-card overflow-hidden"
        >
          <div className="p-4 border-b border-outline-variant/40">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-display font-semibold text-on-surface">
                  {bakery.name}
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  {bakery.city} ·
                  {bakery.active_listing_count} deal
                  {bakery.active_listing_count === 1 ? "" : "s"} available
                </p>
              </div>
              <Link
                href={`/bakeries/${bakery.id}`}
                className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-xs font-semibold text-on-surface transition-colors hover:bg-secondary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                View bakery →
              </Link>
            </div>
          </div>

          <div className="p-4">
            <ListingGrid
              listings={bakery.listings}
              action="cart"
              loading={false}
              skeletonCount={0}
            />
          </div>
        </section>
      ))}
    </div>
  );
}

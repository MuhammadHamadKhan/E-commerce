"use client";
// ListingGrid: responsive grid of ListingCards with skeleton loaders
// matching the exact card aspect ratio and ticket divider structure.
import ListingCard from "./ListingCard";
import type { Listing } from "@/lib/api/types";

export function ListingCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-card border border-outline-variant/50 bg-surface-container-lowest shadow-card ${
        featured ? "sm:col-span-2 sm:flex-row" : ""
      }`}
      aria-hidden="true"
    >
      <div
        className={`animate-pulse bg-surface-container-high ${
          featured ? "h-64 sm:h-auto sm:w-1/2" : "aspect-[4/3] w-full"
        }`}
      />
      <div className={`flex flex-1 flex-col justify-between p-4 ${featured ? "sm:p-6" : ""}`}>
        <div className="space-y-2">
          <div className="h-3 w-28 animate-pulse rounded-full bg-surface-container-high" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-surface-container-high" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-surface-container-high" />
        </div>
        <div className="mt-4 border-t border-dashed border-outline-variant/60 pt-3">
          <div className="flex items-center justify-between">
            <div className="h-6 w-24 animate-pulse rounded bg-surface-container-high" />
            <div className="h-9 w-20 animate-pulse rounded-full bg-surface-container-high" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListingGrid({
  listings,
  action = "none",
  loading = false,
  skeletonCount = 4,
  featuredFirst = false,
}: {
  listings: Listing[];
  action?: "cart" | "reserve" | "none";
  loading?: boolean;
  skeletonCount?: number;
  featuredFirst?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {loading && (
        <>
          {Array.from({ length: skeletonCount }, (_, index) => (
            <ListingCardSkeleton
              key={`skeleton-${index}`}
              featured={featuredFirst && index === 0}
            />
          ))}
        </>
      )}
      {listings.map((listing, index) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          action={action}
          featured={featuredFirst && index === 0}
        />
      ))}
    </div>
  );
}

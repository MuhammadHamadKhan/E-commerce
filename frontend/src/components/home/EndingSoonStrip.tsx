"use client";
// Ending Soon strip: horizontal scroll of the deals nearest to expiry.
import { useRef } from "react";
import ListingCard from "@/components/listing/ListingCard";
import { ListingCardSkeleton } from "@/components/listing/ListingGrid";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { Listing } from "@/lib/api/types";

type EndingSoonData = {
  data?: { listings: Listing[] };
  isPending: boolean;
  isError: boolean;
};

type EndingSoonStripProps = {
  endingSoon: EndingSoonData;
};

export default function EndingSoonStrip({ endingSoon }: EndingSoonStripProps) {
  const endingSoonRef = useRef<HTMLDivElement>(null);

  const scrollEndingSoon = (direction: "left" | "right") => {
    if (!endingSoonRef.current) return;
    const offset = direction === "left" ? -340 : 340;
    endingSoonRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold text-on-surface sm:text-3xl">
            Closing soon
          </h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            These bakeries close within hours. Reserve before they do.
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollEndingSoon("left")}
            aria-label="Scroll deals left"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface transition-colors hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-secondary"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollEndingSoon("right")}
            aria-label="Scroll deals right"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface transition-colors hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-secondary"
          >
            →
          </button>
        </div>
      </div>

      <div className="relative -mx-gutter-mobile px-gutter-mobile md:mx-0 md:px-0">
        {endingSoon.isPending && (
          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[260px] shrink-0 sm:w-[300px]">
                <ListingCardSkeleton />
              </div>
            ))}
          </div>
        )}

        {endingSoon.isError && (
          <ErrorMessage
            message="We couldn't load the closing-soon deals. Check your connection and refresh the page."
          />
        )}

        {endingSoon.data && endingSoon.data.listings.length > 0 && (
          <div
            ref={endingSoonRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
          >
            {endingSoon.data.listings.map((listing) => (
              <div key={listing.id} className="w-[260px] shrink-0 snap-start sm:w-[300px]">
                <ListingCard listing={listing} action="cart" />
              </div>
            ))}
          </div>
        )}

        {endingSoon.data?.listings.length === 0 && (
          <EmptyState
            title="Nothing closing soon"
            description="Bakeries add new items around 4 PM. Check back this afternoon."
          />
        )}
      </div>
    </section>
  );
}

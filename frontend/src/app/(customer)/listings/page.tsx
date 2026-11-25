"use client";
// LISTINGS PAGE: /listings
// The flat active-listings feed with city/search/sort filters and load-more paging.
// Clicking any card opens /listings/[id] (already built).
import { useEffect, useRef, useState } from "react";
import FilterBar from "@/components/listing/FilterBar";
import ListingGrid, { ListingCardSkeleton } from "@/components/listing/ListingGrid";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { NEIGHBORHOOD_CHIPS, PAGE_SIZE } from "@/components/home/constants";
import { useListings } from "@/hooks/queries/useListings";
import type { Listing } from "@/lib/api/types";
import type { ListingFilters } from "@/lib/api/listings";

type MainListingsData = {
  data?: { listings: Listing[]; total: number };
  isPending: boolean;
  isError: boolean;
  error: unknown;
  isFetching: boolean;
  refetch: () => void;
};

export default function ListingsPage() {
  const [filters, setFilters] = useState<ListingFilters>({ page: 1, limit: PAGE_SIZE });
  const [items, setItems] = useState<Listing[]>([]);
  const loadedPage = useRef(0);

  const main = useListings(filters);

  // Accumulate pages as the user clicks "Load more"
  useEffect(() => {
    const data = main.data;
    if (!data) return;
    if (data.page === 1) setItems(data.listings);
    else if (data.page === loadedPage.current + 1) {
      setItems((previous) => [...previous, ...data.listings]);
    }
    loadedPage.current = data.page;
  }, [main.data]);

  const total = main.data?.total ?? 0;
  const hasMore = items.length < total;
  const sort = filters.sort ?? "ending_soon";
  const city = filters.city ?? "";

  return (
    <section id="all-bakes" className="space-y-6">
      {/* Header + filter bar */}
      <div className="flex flex-col gap-4 border-b border-outline-variant/50 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-on-surface sm:text-3xl">
            All deals
          </h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Active discounted bakes from Peshawar bakeries.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <FilterBar
            city={city}
            sort={sort}
            onChange={(next) =>
              setFilters((prev) => ({ ...prev, ...next, page: 1 }))
            }
          />
        </div>
      </div>

      {/* Neighborhood quick-filter chips */}
      <div
        className="no-scrollbar -mx-gutter-mobile flex gap-2 overflow-x-auto px-gutter-mobile pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        role="group"
        aria-label="Filter by area"
      >
        {NEIGHBORHOOD_CHIPS.map((chip) => {
          const isActive =
            chip.query === "" ? !city : city.toLowerCase() === chip.query.toLowerCase();
          return (
            <button
              key={chip.label}
              type="button"
              aria-pressed={isActive}
              onClick={() =>
                setFilters((prev) => ({ ...prev, city: chip.query, page: 1 }))
              }
              className={`min-h-[40px] shrink-0 rounded-full px-4 text-label-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                isActive
                  ? "bg-on-surface text-surface-container-lowest"
                  : "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Listings grid */}
      <div>
        {main.isPending && items.length === 0 && (
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <ListingCardSkeleton key={index} featured={index === 0} />
            ))}
          </div>
        )}

        {main.isError && (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
            <ErrorMessage message={String(main.error)} />
            <Button variant="outline" size="sm" onClick={() => main.refetch()}>
              Try again
            </Button>
          </div>
        )}

        {items.length > 0 && (
          <ListingGrid
            listings={items}
            action="reserve"
            featuredFirst={filters.page === 1}
          />
        )}

        {main.data && items.length === 0 && (
          <EmptyState
            title="No bakes match your search"
            description="Choose “All Peshawar areas” or try a different word."
          />
        )}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            loading={main.isFetching}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))
            }
            className="min-h-[44px] w-full rounded-full border-outline-variant px-8 font-semibold hover:border-secondary hover:text-secondary sm:w-auto"
          >
            Show {total - items.length} more
          </Button>
        </div>
      )}
    </section>
  );
}

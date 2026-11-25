"use client";
// All Deals section: filter bar, neighborhood chips, deals grid, and Load more.
import FilterBar from "@/components/listing/FilterBar";
import ListingGrid, { ListingCardSkeleton } from "@/components/listing/ListingGrid";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { NEIGHBORHOOD_CHIPS, PAGE_SIZE } from "./constants";
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

type AllDealsProps = {
  city: string;
  search: string;
  sort: ListingFilters["sort"];
  setFilter: (next: Partial<ListingFilters> & { page?: number }) => void;
  main: MainListingsData;
  items: Listing[];
  hasMore: boolean;
  page: number;
  total: number;
};

export default function AllDeals({
  city,
  search,
  sort,
  setFilter,
  main,
  items,
  hasMore,
  page,
  total,
}: AllDealsProps) {
  return (
    <section id="all-bakes" className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-outline-variant/50 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold text-on-surface sm:text-3xl">
            All of tonight&apos;s bakes
          </h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Baked fresh today by bakeries across Peshawar.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <FilterBar
            city={city}
            sort={sort ?? "ending_soon"}
            onChange={(next) =>
              setFilter({ ...next, sort: next.sort as ListingFilters["sort"], page: 1 })
            }
          />
        </div>
      </div>

      <div
        className="no-scrollbar -mx-gutter-mobile flex gap-2 overflow-x-auto px-gutter-mobile pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        role="group"
        aria-label="Filter by area"
      >
        {NEIGHBORHOOD_CHIPS.map((chip) => {
          const isActive =
            chip.query === "" ? !search : search.toLowerCase() === chip.query.toLowerCase();
          return (
            <button
              key={chip.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFilter({ search: chip.query, page: 1 })}
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

      <div>
        {main.isPending && (
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
            featuredFirst={page === 1}
          />
        )}

        {main.data && items.length === 0 && (
          <EmptyState
            title="No bakes match your search"
            description="Choose “All Peshawar areas” or try a different word."
          />
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            loading={main.isFetching}
            onClick={() => setFilter({ page: page + 1 })}
            className="min-h-[44px] w-full rounded-full border-outline-variant px-8 font-semibold hover:border-secondary hover:text-secondary sm:w-auto"
          >
            Show {total - items.length} more
          </Button>
        </div>
      )}
    </section>
  );
}

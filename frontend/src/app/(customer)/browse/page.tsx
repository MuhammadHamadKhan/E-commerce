"use client";
// BROWSE page: grouped discovery view with search.
// Search is debounced (~800ms after typing stops) so the backend isn't
// hammered on every keystroke.
import { useEffect, useState, useCallback, useRef } from "react";
import { BiggestDiscountsSection } from "@/components/browse/BiggestDiscountsSection";
import { BakeryGroupSection } from "@/components/browse/BakeryGroupSection";
import { getBrowse } from "@/lib/api/listings";
import type { BrowseResponse } from "@/lib/api/listings";
import ErrorMessage from "@/components/ui/ErrorMessage";

const DEBOUNCE_MS = 800;

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [request, setRequest] = useState({ id: 0, search: "" });
  const [data, setData] = useState<BrowseResponse | null>(null);
  const [settledRequestId, setSettledRequestId] = useState(-1);
  const [failure, setFailure] = useState<{
    requestId: number;
    message: string;
  } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loading = settledRequestId !== request.id;
  const error =
    failure?.requestId === request.id ? failure.message : null;

  const submitSearch = useCallback((search: string) => {
    setRequest((current) => ({ id: current.id + 1, search }));
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Debounced: fire ~DEBOUNCE_MS after the user stops typing.
  const handleQueryChange = useCallback((next: string) => {
    setQuery(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      submitSearch(next);
    }, DEBOUNCE_MS);
  }, [submitSearch]);

  // Immediate on Enter / Search button.
  const handleSearch = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    submitSearch(query);
  }, [query, submitSearch]);

  useEffect(() => {
    let cancelled = false;
    setSettledRequestId(request.id);
    getBrowse({ search: request.search })
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setFailure(null);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setFailure({
            requestId: request.id,
            message:
              requestError instanceof Error
                ? requestError.message
                : "Unable to load browse results. Please try again.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [request]);

  const sections = data?.sections ?? {
    ending_soon: [],
    biggest_discounts: [],
    bakeries: [],
  };

  // No results for current search.
  const isEmptySearch =
    query.trim() !== "" &&
    sections.biggest_discounts.length === 0 &&
    sections.bakeries.length === 0;

  return (
    <div className="space-y-xl">
      <div className="mt-lg flex justify-center">
        <div className="w-full sm:max-w-[420px]">
          <SearchBar
            query={query}
            onQueryChange={handleQueryChange}
            onSearch={handleSearch}
          />
        </div>
      </div>
      {error && <ErrorMessage message={error} />}

      {isEmptySearch && (
        <section className="rounded-card border border-outline-variant/50 bg-surface-container-low p-lg text-center">
          <p className="text-body-sm text-on-surface-variant">
            No deals match “{query}”. Try another search.
          </p>
        </section>
      )}

      <section className="flex flex-col gap-sm">
        <h2 className="font-display font-semibold text-on-surface text-xl sm:text-2xl">
          Biggest discounts
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          The deepest price cuts of the day.
        </p>
        <BiggestDiscountsSection listings={sections.biggest_discounts} />
      </section>

      <section className="flex flex-col gap-sm">
        <h2 className="font-display font-semibold text-on-surface text-xl sm:text-2xl">
          By bakery
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          Browse deals grouped by neighborhood bakery.
        </p>
        <BakeryGroupSection bakeries={sections.bakeries} />
      </section>
    </div>
  );
}

// Search bar: input + search button, same style on both pages.
function SearchBar({
  query,
  onQueryChange,
  onSearch,
}: {
  query: string;
  onQueryChange: (next: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="flex gap-2">
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSearch();
          }
        }}
        placeholder="Search bakery name or area…"
        className="flex-1 min-h-[44px] rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-on-surface focus:outline-2 focus:outline-offset-2 focus:outline-secondary"
      />
      <button
        type="button"
        onClick={onSearch}
        className="min-h-[44px] px-6 py-2 rounded-full border border-outline-variant bg-transparent text-on-surface font-semibold cursor-pointer hover:bg-secondary hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      >
        Search
      </button>
    </div>
  );
}

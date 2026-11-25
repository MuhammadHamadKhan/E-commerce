"use client";
// Bakeries page: lists all registered bakeries in cards with pagination.
// Search matches bakery name or city (partial, case-insensitive).
// Typing is debounced (~800ms) and clicking Search fires immediately.
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useBakeries } from "@/hooks/queries/useBakeries";
import type { Bakery } from "@/lib/api/types";
import BakeryCard from "@/components/bakery/BakeryCard";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import ErrorMessage from "@/components/ui/ErrorMessage";

const PAGE_SIZE = 12;
const DEBOUNCE_MS = 800;

export default function BakeriesPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search that actually triggers the API call.
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isPending, isError, error } = useBakeries({
    search: searchQuery || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const bakeries: Bakery[] = data?.bakeries ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  // Run the search now with the current query text.
  const runSearch = useCallback((next: string) => {
    setSearchQuery(next);
    setPage(1);
    // Focus after React commits the re-render so the input keeps focus.
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  // Debounce: fire ~DEBOUNCE_MS after the user stops typing.
  const handleQueryChange = useCallback(
    (next: string) => {
      setQuery(next);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        runSearch(next);
      }, DEBOUNCE_MS);
    },
    [runSearch]
  );

  // Clear timer on unmount.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (isPending && bakeries.length === 0) {
    return (
      <Container>
        <div className="py-xl text-center">
          <p className="text-body-sm text-on-surface-variant">Loading bakeries…</p>
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorMessage message={String(error)} />
      </Container>
    );
  }

  return (
    <Container className="py-lg">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-lg">
        <div>
          <h1 className="font-display font-semibold text-on-surface text-2xl sm:text-3xl">
            Peshawar Bakeries
          </h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            {total} bakery{total === 1 ? "" : "s"} across the city
          </p>
        </div>

        <div className="flex gap-2 w-full sm:max-w-[420px] sm:justify-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search bakery name or area…"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                runSearch(query);
              }
            }}
            className="flex-1 min-h-[44px] rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-on-surface focus:outline-2 focus:outline-offset-2 focus:outline-secondary"
          />
          <button
            type="button"
            onClick={() => runSearch(query)}
            disabled={query === ""}
            className="min-h-[44px] px-6 py-2 rounded-full border border-outline-variant bg-transparent text-on-surface font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            Search
          </button>
        </div>
      </header>

      {bakeries.length === 0 && (
        <div className="rounded-card border border-outline-variant/50 bg-surface-container-low p-6 text-center">
          <p className="text-body-sm text-on-surface-variant">
            {query ? `No bakeries match “${query}”.` : "No bakeries registered yet."}
          </p>
        </div>
      )}

      {bakeries.length > 0 && (
        <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bakeries.map((bakery) => (
            <BakeryCard key={bakery.id} bakery={bakery} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          className="mt-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          aria-label="Bakery pagination"
        >
          <p className="text-body-sm text-on-surface-variant">
            Page {page} of {totalPages} &middot; {total} bakery{total === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!hasPrev}
            >
              ← Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!hasNext}
            >
              Next →
            </Button>
          </div>
        </nav>
      )}
    </Container>
  );
}

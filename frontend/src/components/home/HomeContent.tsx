"use client";
// HomeContent composes the page sections and supplies them with live listing data.
import { useEffect, useRef, useState } from "react";
import AllDeals from "./AllDeals";
import EndingSoonStrip from "./EndingSoonStrip";
import FreshnessNote from "./FreshnessNote";
import HomeHero from "./HomeHero";
import HowItWorksSection from "./HowItWorks";
import { PAGE_SIZE } from "./constants";
import { useHomeFilters } from "./useHomeFilters";
import { useListings } from "@/hooks/queries/useListings";
import type { Listing } from "@/lib/api/types";

export default function HomeContent() {
  const { city, search, sort, page, setFilter } = useHomeFilters();
  const endingSoon = useListings({ sort: "ending_soon", limit: 6 });
  const main = useListings({
    city: city || undefined,
    search: search || undefined,
    sort,
    page,
    limit: PAGE_SIZE,
  });

  const [items, setItems] = useState<Listing[]>([]);
  const loadedPage = useRef(0);

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

  return (
    <div className="space-y-14 sm:space-y-20">
      <HomeHero
        highlight={endingSoon.data?.listings[0] ?? null}
        isLoading={endingSoon.isLoading}
        total={total}
      />
      <EndingSoonStrip endingSoon={endingSoon} />
      <AllDeals
        city={city}
        search={search}
        sort={sort}
        setFilter={setFilter}
        main={main}
        items={items}
        hasMore={items.length < total}
        page={page}
        total={total}
      />
      <HowItWorksSection />
      <FreshnessNote total={total} />
    </div>
  );
}

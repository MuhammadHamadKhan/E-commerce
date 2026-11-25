"use client";
// Home filter logic: reads city/search/sort/page from the URL and returns a
// setFilter helper to update the address without losing other params.
import { useRouter, useSearchParams } from "next/navigation";
import type { ListingFilters } from "@/lib/api/listings";

export function useHomeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const city = searchParams.get("city") ?? "";
  const search = searchParams.get("search") ?? "";
  const sort = (searchParams.get("sort") ?? "ending_soon") as ListingFilters["sort"];
  const page = Number(searchParams.get("page")) || 1;

  const setFilter = (next: Partial<ListingFilters> & { page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      const text = String(value ?? "");
      if (text === "" || (key === "page" && text === "1")) params.delete(key);
      else params.set(key, text);
    }
    router.replace(`/?${params.toString()}`, { scroll: next.page === undefined });
  };

  return { city, search, sort, page, setFilter };
}

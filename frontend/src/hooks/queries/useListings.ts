"use client";
// useListings: reads the active listings feed (with filters) using React
// Query. "placeholderData: keepPreviousData" keeps the previous page's
// listings visible while the next page/filters load, so the grid does
// not jump to empty.
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getListings, type ListingFilters } from "@/lib/api/listings";
import { queryKeys } from "@/lib/queryKeys";

export function useListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: queryKeys.listings.list(filters),
    queryFn: () => getListings(filters),
    placeholderData: keepPreviousData, // show old data while loading new
  });
}

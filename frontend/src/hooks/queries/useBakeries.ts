"use client";
// useBakeries: reads registered bakeries (paginated).
// keepPreviousData keeps old results visible while a new search/page loads,
// so the grid does not flicker to empty between requests.
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBakeries } from "@/lib/api/bakeries";
import { queryKeys } from "@/lib/queryKeys";

export function useBakeries({
  city,
  search,
  page = 1,
  limit = 12,
}: {
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}) {
  return useQuery({
    queryKey: queryKeys.bakeries.list(city, search, page, limit),
    queryFn: () => getBakeries({ city, search, page, limit }),
    placeholderData: keepPreviousData,
  });
}

"use client";
// useBakery: reads one bakery plus its active listings.
import { useQuery } from "@tanstack/react-query";
import { getBakery } from "@/lib/api/bakeries";
import { queryKeys } from "@/lib/queryKeys";

export function useBakery(id: number | string) {
  return useQuery({
    queryKey: queryKeys.bakeries.detail(id),
    queryFn: () => getBakery(id),
  });
}

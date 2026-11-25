"use client";
// useListing: reads one active listing by id.
import { useQuery } from "@tanstack/react-query";
import { getListing } from "@/lib/api/listings";
import { queryKeys } from "@/lib/queryKeys";

export function useListing(id: number | string) {
  return useQuery({
    queryKey: queryKeys.listings.detail(id),
    queryFn: () => getListing(id),
  });
}

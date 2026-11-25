"use client";
// useMyListings: reads the bakery's own listings, optional status filter.
import { useQuery } from "@tanstack/react-query";
import { getMyListings } from "@/lib/api/bakeryListings";
import { queryKeys } from "@/lib/queryKeys";
import { useAppSelector } from "@/store/hooks";

export function useMyListings(status?: "active" | "expired" | "soldout") {
  const isLoggedIn = useAppSelector((state) => state.auth.status === "loggedIn");

  return useQuery({
    queryKey: queryKeys.bakery.listings.list(status),
    queryFn: () => getMyListings(status ? { status } : {}),
    enabled: isLoggedIn,
  });
}

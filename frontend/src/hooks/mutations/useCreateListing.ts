"use client";
// useCreateListing: puts one of my products on sale and refreshes the
// bakery listings (and the public feed, which shows the same listing).
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMyListing, type ListingInput } from "@/lib/api/bakeryListings";
import { queryKeys } from "@/lib/queryKeys";

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ListingInput) => createMyListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bakery.listings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
    },
  });
}

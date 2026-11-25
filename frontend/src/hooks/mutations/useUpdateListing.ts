"use client";
// useUpdateListing: edits price/quantity/times of one of my listings.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyListing, type ListingInput } from "@/lib/api/bakeryListings";
import { queryKeys } from "@/lib/queryKeys";

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<Omit<ListingInput, "product_id">> }) =>
      updateMyListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bakery.listings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
    },
  });
}
